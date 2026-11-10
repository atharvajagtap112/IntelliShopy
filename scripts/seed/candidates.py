"""Gather candidate product photos from Unsplash and draw numbered contact sheets.

Photos are free under the Unsplash License (https://unsplash.com/license) and the
API guidelines require hotlinking their image URLs, which is what the seed does.
Unsplash+ premium photos are watermarked/paid, so they are dropped here.

    python candidates.py               # -> candidates.json + candidates_<category>.jpg

The sheets are reviewed by eye: picks are recorded in picks.json and anything
watermarked, logo'd or off-topic is simply not picked.
Needs UNSPLASH_ACCESS_KEY in intellishopy/.env (demo apps get 50 requests/hour;
this uses ~18).
"""
import io
import json
import os
from pathlib import Path

import requests
from PIL import Image, ImageDraw

HERE = Path(__file__).parent
API = "https://api.unsplash.com/search/photos"

QUERIES = {
    "mens_tshirt":  ["man t-shirt", "man plain tshirt", "men polo shirt"],
    "mens_hoodie":  ["man hoodie", "hoodie streetwear", "man sweatshirt"],
    "women_kurta":  ["kurta", "indian woman kurti", "salwar suit"],
    "women_dress":  ["woman dress fashion", "summer dress", "maxi dress"],
    "shirt":        ["man shirt fashion", "men formal shirt", "men casual shirt"],
    "lengha_choli": ["lehenga", "indian bride lehenga", "lehenga choli"],
}


def load_key():
    key = os.environ.get("UNSPLASH_ACCESS_KEY")
    env = HERE.parent.parent / ".env"
    if not key and env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if line.startswith("UNSPLASH_ACCESS_KEY="):
                key = line.split("=", 1)[1].strip().strip('"')
    if not key:
        raise SystemExit("UNSPLASH_ACCESS_KEY not set in intellishopy/.env")
    return key


def gather():
    session = requests.Session()
    session.headers.update({"Authorization": f"Client-ID {load_key()}", "Accept-Version": "v1"})
    out, seen = {}, set()
    for cat, queries in QUERIES.items():
        picked = []
        for q in queries:
            r = session.get(API, timeout=30, params={
                "query": q, "orientation": "portrait", "per_page": 30, "content_filter": "high"})
            r.raise_for_status()
            for ph in r.json()["results"]:
                raw = ph["urls"]["raw"]
                if ph["id"] in seen or ph.get("premium") or "plus.unsplash.com" in raw:
                    continue
                seen.add(ph["id"])
                picked.append({
                    "unsplash_id": ph["id"], "raw": raw, "thumb": ph["urls"]["small"],
                    "alt": ph.get("alt_description") or ph.get("description") or "",
                    "color": ph.get("color"), "creator": ph["user"]["name"],
                    "landing": ph["links"]["html"],
                })
        out[cat] = picked
        print(f"{cat}: {len(picked)} candidates (rate limit left: {r.headers.get('X-Ratelimit-Remaining')})")
    return out


def sheet(cat, items):
    tw, th, lh, cols = 230, 330, 18, 8
    rows = (len(items) + cols - 1) // cols
    img = Image.new("RGB", (cols * tw, rows * (th + lh)), "white")
    d = ImageDraw.Draw(img)
    for i, it in enumerate(items):
        x, y = (i % cols) * tw, (i // cols) * (th + lh)
        try:
            im = Image.open(io.BytesIO(requests.get(it["thumb"], timeout=30).content)).convert("RGB")
            im.thumbnail((tw - 6, th - 6))
            img.paste(im, (x + 3, y + 3))
        except Exception:
            d.text((x + 6, y + 6), "LOAD FAIL", fill="red")
        d.rectangle([x, y + th, x + tw, y + th + lh], fill="black")
        d.text((x + 4, y + th + 3), f"#{i}  {it['alt'][:30]}", fill="yellow")
    path = HERE / f"candidates_{cat}.jpg"
    img.save(path, quality=88)
    return path


def main():
    cands = gather()
    (HERE / "candidates.json").write_text(json.dumps(cands, indent=1, ensure_ascii=False), encoding="utf-8")
    for cat, items in cands.items():
        print("sheet ->", sheet(cat, items))


if __name__ == "__main__":
    main()
