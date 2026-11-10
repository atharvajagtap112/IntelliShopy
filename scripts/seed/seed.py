"""Seed new categories, products, demo reviewers and reviews.

    python seed.py --target local  [--dry-run]
    python seed.py --target aiven  [--dry-run]

Connection settings come from intellishopy/.env (or the environment):
    local: DB_HOST (default localhost), DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
    aiven: AIVEN_DB_HOST, AIVEN_DB_PORT, AIVEN_DB_NAME, AIVEN_DB_USERNAME, AIVEN_DB_PASSWORD

Idempotent: categories match by name, demo users by email, products by image
URL, and products that already have demo reviews get none added. Everything
runs in one transaction; --dry-run rolls it back after printing what it did.
"""
import argparse
import json
import os
import random
from datetime import datetime, timedelta
from pathlib import Path

import mysql.connector

from reviews import DEMO_USERS, reviews_for

HERE = Path(__file__).parent
# Demo reviewers can never log in: this is not a valid BCrypt hash, so Spring's
# BCryptPasswordEncoder.matches() is always false for it.
NO_LOGIN_PASSWORD = "!seed-demo-account-no-login"
# Hibernate's table-backed sequences hand out ids in blocks of 50. Seeded ids
# start a block past next_val (a running app may hold the block below it), and
# next_val ends two blocks past the last seeded id.
HIBERNATE_BLOCK = 50


def load_env():
    env = dict(os.environ)
    path = HERE.parent.parent / ".env"
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                env.setdefault(k.strip(), v.strip().strip('"'))
    return env


def connect(target):
    env = load_env()
    p = "AIVEN_DB_" if target == "aiven" else "DB_"
    host = env.get(p + "HOST") or ("localhost" if target == "local" else None)
    if not host:
        raise SystemExit(f"{p}HOST is not set in intellishopy/.env")
    kwargs = dict(host=host, port=int(env.get(p + "PORT") or 3306),
                  database=env.get(p + "NAME") or "ecommerce",
                  user=env.get(p + "USERNAME") or "root",
                  password=env.get(p + "PASSWORD") or "", autocommit=False)
    if target == "aiven":
        kwargs["ssl_disabled"] = False   # Aiven only accepts TLS connections
    print(f"-> {target}: {kwargs['user']}@{host}:{kwargs['port']}/{kwargs['database']}")
    return mysql.connector.connect(**kwargs)


class IdAllocator:
    """Hands out ids for a Hibernate table-backed sequence (e.g. product_seq)."""

    def __init__(self, cur, entity):
        self.cur, self.entity = cur, entity
        cur.execute(f"SELECT next_val FROM {entity}_seq FOR UPDATE")
        next_val = cur.fetchone()[0]
        cur.execute(f"SELECT COALESCE(MAX(id), 0) FROM {entity}")
        self.next = max(next_val, cur.fetchone()[0] + 1) + HIBERNATE_BLOCK
        self.used = False

    def take(self):
        self.used = True
        self.next += 1
        return self.next - 1

    def finish(self):
        if self.used:
            self.cur.execute(f"UPDATE {self.entity}_seq SET next_val = %s",
                             (self.next + 2 * HIBERNATE_BLOCK,))


def ensure_categories(cur, catalog, cat_ids):
    created = 0
    for c in catalog["new_categories"]:
        if c["name"] in cat_ids:
            continue
        # Parent is the level-2 "Clothing" under the given top-level category.
        cur.execute("""SELECT c2.id FROM category c2 JOIN category c1 ON c1.id = c2.parent_category_id
                       WHERE c2.level = 2 AND LOWER(c2.name) = 'clothing' AND LOWER(c1.name) = LOWER(%s)""",
                    (c["parent"],))
        row = cur.fetchone()
        if not row:
            raise SystemExit(f"parent Clothing category for {c['parent']} not found")
        alloc = cat_ids["__alloc__"]
        new_id = alloc.take()
        cur.execute("INSERT INTO category (id, level, name, parent_category_id) VALUES (%s, 3, %s, %s)",
                    (new_id, c["name"], row[0]))
        cat_ids[c["name"]] = new_id
        created += 1
    return created


def ensure_users(cur):
    ids, created = [], 0
    now = datetime.now()
    for first, last, _ in DEMO_USERS:
        email = f"{first.lower()}.{last.lower()}@example.com"
        cur.execute("SELECT id FROM user WHERE email = %s", (email,))
        row = cur.fetchone()
        if row:
            ids.append(row[0])
            continue
        cur.execute("""INSERT INTO user (created_at, email, first_name, last_name, mobile, password, role)
                       VALUES (%s, %s, %s, %s, NULL, %s, 'CUSTOMER')""",
                    (now - timedelta(days=200), email, first, last, NO_LOGIN_PASSWORD))
        ids.append(cur.lastrowid)
        created += 1
    return ids, created


def insert_products(cur, catalog, cat_ids, alloc):
    created, skipped = 0, 0
    now = datetime.now()
    cur.execute("SELECT image_url FROM product")
    existing = {row[0] for row in cur.fetchall()}
    for p in catalog["products"]:
        if not p.get("image_url") or p["image_url"] in existing:
            skipped += 1
            continue

        pid = alloc.take()
        rng = random.Random(pid)
        sizes = [(s, rng.choice([10, 15, 20, 25, 30, 40])) for s in catalog["sizes"][p["category"]]]
        total = sum(q for _, q in sizes)
        discount_price = round(p["price"] * (100 - p["discount"]) / 100)
        cur.execute("""INSERT INTO product (id, brand, color, created_at, description, discount_present,
                           discount_price, image_url, num_rating, price, quantity, title, category_id)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 0, %s, %s, %s, %s)""",
                    (pid, p["brand"], p["color"], now - timedelta(days=rng.randint(20, 90)),
                     p["description"][:255], p["discount"], discount_price, p["image_url"],
                     p["price"], total, p["title"], cat_ids[p["category"]]))
        cur.executemany("INSERT INTO product_sizes (product_id, name, quantity, stock) VALUES (%s, %s, %s, %s)",
                        [(pid, s, q, q) for s, q in sizes])
        created += 1
    return created, skipped


def insert_reviews(cur, user_ids, alloc):
    cur.execute("""SELECT p.id, c.name, p.created_at FROM product p JOIN category c ON c.id = p.category_id
                   WHERE NOT EXISTS (SELECT 1 FROM review r WHERE r.product_id = p.id AND r.user_id IN ({}))"""
                .format(",".join(["%s"] * len(user_ids))), user_ids)
    products = cur.fetchall()
    now, review_rows, rating_rows = datetime.now(), [], []
    for pid, category, created_at in products:
        start = created_at or now - timedelta(days=120)
        span = max(1, int((now - start).total_seconds()))
        rng = random.Random(f"date-{pid}")
        for u, rating, text in reviews_for(pid, category):
            when = start + timedelta(seconds=rng.randint(span // 10, span))
            review_rows.append((alloc.take(), when, text, pid, user_ids[u], float(rating)))
            rating_rows.append((when, float(rating), pid, user_ids[u]))

    # Batched: executemany turns each chunk into one multi-row INSERT. Row-by-row
    # took ~5000 round trips - minutes against a remote DB while holding the
    # sequence locks the live app needs.
    for i in range(0, len(review_rows), 500):
        cur.executemany("INSERT INTO review (id, created_at, review, product_id, user_id, rating) VALUES (%s, %s, %s, %s, %s, %s)",
                        review_rows[i:i + 500])
        cur.executemany("INSERT INTO rating (created_at, rating, product_id, user_id) VALUES (%s, %s, %s, %s)",
                        rating_rows[i:i + 500])
    if products:
        cur.execute("""UPDATE product p SET num_rating = (SELECT COUNT(*) FROM rating r WHERE r.product_id = p.id)
                       WHERE p.id IN ({})""".format(",".join(["%s"] * len(products))), [p[0] for p in products])
    return len(products), len(review_rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--target", choices=["local", "aiven"], required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    catalog = json.loads((HERE / "products.resolved.json").read_text(encoding="utf-8"))
    conn = connect(args.target)
    cur = conn.cursor()
    try:
        cur.execute("SELECT name, id FROM category WHERE level = 3")
        cat_ids = dict(cur.fetchall())
        cat_alloc = IdAllocator(cur, "category")
        cat_ids["__alloc__"] = cat_alloc
        product_alloc, review_alloc = IdAllocator(cur, "product"), IdAllocator(cur, "review")

        n_cats = ensure_categories(cur, catalog, cat_ids)
        user_ids, n_users = ensure_users(cur)
        n_products, n_skipped = insert_products(cur, catalog, cat_ids, product_alloc)
        n_reviewed, n_reviews = insert_reviews(cur, user_ids, review_alloc)
        for a in (cat_alloc, product_alloc, review_alloc):
            a.finish()

        print(f"categories +{n_cats} | demo users +{n_users} | products +{n_products} "
              f"(skipped {n_skipped}) | reviews +{n_reviews} on {n_reviewed} products")
        if args.dry_run:
            conn.rollback()
            print("dry run: rolled back, nothing written")
        else:
            conn.commit()
            print("committed")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
