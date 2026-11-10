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
tokenizer = open_clip.get_tokenizer("ViT-B-32")

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
# Text → embedding
# --------------------
# CLIP puts text and images in the same embedding space, so a text vector can be
# searched against the existing image index directly - no re-indexing needed.
# "a photo of ..." is the prompt template CLIP was trained to match images with;
# it ranks noticeably better than the bare query.
def text_to_embedding(text):
    tokens = tokenizer([f"a photo of {text}"]).to(device)

    with torch.no_grad():
        embedding = model.encode_text(tokens)

    embedding = embedding / embedding.norm(dim=-1, keepdim=True)
    return embedding.cpu().numpy().astype("float32")

def ranked_ids(query_vec, k):
    scores, indices = index.search(query_vec, k)
    # FAISS pads with -1 when it has fewer than k vectors; product_ids[-1] would
    # silently return the last product, so filter on >= 0, not just < len.
    return [
        (product_ids[i], float(s))
        for i, s in zip(indices[0], scores[0])
        if 0 <= i < len(product_ids)
    ]

@app.get("/health")
async def health_check():
    return {"status": "awake"}

# --------------------
# Search API
# --------------------
@app.post("/search")
async def search_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    query_vec = image_to_embedding(image_bytes)

    return {"productIds": [pid for pid, _ in ranked_ids(query_vec, 10)]}

@app.get("/search/text")
async def search_text(q: str, k: int = 20):
    q = q.strip()[:200]
    if not q:
        return {"productIds": [], "scores": []}

    results = ranked_ids(text_to_embedding(q), max(1, min(k, 50)))
    return {
        "productIds": [pid for pid, _ in results],
        "scores": [round(s, 4) for _, s in results],
    }
