from fastapi import FastAPI, UploadFile, File
import faiss
import numpy as np
import torch
import open_clip
from PIL import Image
import io
import os
from fastapi.middleware.cors import CORSMiddleware
device = "cpu"
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
INDEX_FILE = "products.index"
IDS_FILE = "product_ids.npy"

# --------------------
# Load CLIP
# --------------------
model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="openai",
    device=device
)
model.eval()

# --------------------
# Load FAISS index
# --------------------
index = faiss.read_index(INDEX_FILE)
product_ids = np.load(IDS_FILE).tolist()

# --------------------
# Image → embedding
# --------------------
def image_to_embedding(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        embedding = model.encode_image(image)

    embedding = embedding / embedding.norm(dim=-1, keepdim=True)
    return embedding.cpu().numpy().astype("float32")

# --------------------
# Search API
# --------------------
@app.post("/search")
async def search_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    query_vec = image_to_embedding(image_bytes)

    distances, indices = index.search(query_vec, k=10)

    result_ids = [
        product_ids[i]
        for i in indices[0]
        if i < len(product_ids)
    ]

    return {"productIds": result_ids}
