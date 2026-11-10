"""Join each product's picked candidate onto products.json.

    python resolve_picks.py   # -> products.resolved.json, CREDITS.md, contact_sheet.jpg

image_url is the Unsplash hotlink (required by their API guidelines) cropped to
the 3:4 product-card shape. contact_sheet.jpg shows every final photo large
enough to spot watermarks or logos before seeding.
"""
import io
import json
from pathlib import Path

import requests
from PIL import Image, ImageDraw

HERE = Path(__file__).parent
# 3:4 portrait crop, faces kept in frame, compressed JPEG ~80-150 KB.
CROP = "&w=900&h=1200&fit=crop&crop=faces,entropy&q=80&fm=jpg"


def main():
    catalog = json.loads((HERE / "products.json").read_text(encoding="utf-8"))
    candidates = json.loads((HERE / "candidates.json").read_text(encoding="utf-8"))

    for p in catalog["products"]:
        c = candidates[p["category"]][p["pick"]]
        p.update({
            "image_url": c["raw"] + CROP,
            "unsplash_id": c["unsplash_id"],
            "credit": c["creator"],
            "source_url": c["landing"],
        })
        assert len(p["image_url"]) <= 255, p["title"]   # product.image_url is varchar(255)

    ids = [p["unsplash_id"] for p in catalog["products"]]
    assert len(ids) == len(set(ids)), "a photo is used twice"

    (HERE / "products.resolved.json").write_text(json.dumps(catalog, indent=2, ensure_ascii=False), encoding="utf-8")
    write_credits(catalog["products"])
    contact_sheet(catalog["products"])
    print(f"{len(ids)} products resolved")


def write_credits(products):
    lines = ["# Product photo credits", "",
             "Seed product photos are from [Unsplash](https://unsplash.com) under the "
             "[Unsplash License](https://unsplash.com/license) (free to use, attribution "
             "appreciated but not required).", ""]
    lines += [f"- {p['title']}: photo by {p['credit']} ({p['source_url']})" for p in products]
    (HERE / "CREDITS.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def contact_sheet(products):
    tw, th, lh, cols = 300, 400, 34, 8
    rows = (len(products) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw, rows * (th + lh)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, p in enumerate(products):
        x, y = (i % cols) * tw, (i // cols) * (th + lh)
        try:
            url = p["image_url"].replace("w=900&h=1200", "w=300&h=400")
            img = Image.open(io.BytesIO(requests.get(url, timeout=30).content)).convert("RGB")
            img.thumbnail((tw - 4, th - 4))
            sheet.paste(img, (x + 2, y + 2))
        except Exception as e:
            draw.text((x + 4, y + 4), f"LOAD FAIL {e}"[:40], fill="red")
        draw.rectangle([x, y + th, x + tw, y + th + lh], fill="black")
        draw.text((x + 4, y + th + 3), f"{i} [{p['color']}]", fill="yellow")
        draw.text((x + 4, y + th + 17), p["title"].replace("Women ", "W ").replace("Men ", "M ")[:44], fill="white")
    sheet.save(HERE / "contact_sheet.jpg", quality=88)


if __name__ == "__main__":
    main()
