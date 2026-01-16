import mysql.connector
import requests
import faiss
import numpy as np
import torch
from PIL import Image
import open_clip

import io
import os

# --------------------
# CONFIG
# --------------------
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Atharva123*",
    "database": "ecommerce"
}

INDEX_FILE = "products.index"
IDS_FILE = "product_ids.npy"
DIMENSION = 512

# --------------------
# Load CLIP
# --------------------
model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="openai"
)
model.eval()

# --------------------
# Image → embedding
# --------------------
def image_to_embedding(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        embedding = model.encode_image(image)

    embedding = embedding / embedding.norm(dim=-1, keepdim=True)
    return embedding.cpu().numpy().astype("float32")

# --------------------
# Build index
# --------------------
def build_index():
    print("🔹 Connecting to MySQL...")
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, image_url FROM product")
    products = cursor.fetchall()

    index = faiss.IndexFlatIP(DIMENSION)
    product_ids = []

    print(f"🔹 Indexing {len(products)} products...")

    for p in products:
        try:
            response = requests.get(p["image_url"], timeout=5)
            response.raise_for_status()

            vec = image_to_embedding(response.content)
            index.add(vec)
            product_ids.append(p["id"])

            print(f"✅ Indexed product {p['id']}")

        except Exception as e:
            print(f"❌ Failed product {p['id']}: {e}")

    print("💾 Saving FAISS index...")
    faiss.write_index(index, INDEX_FILE)
    np.save(IDS_FILE, np.array(product_ids))

    cursor.close()
    conn.close()

    print("🎉 Offline indexing complete")

if __name__ == "__main__":
    build_index()
