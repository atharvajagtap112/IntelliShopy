# Use a slim Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only PyTorch + torchvision from PyTorch's dedicated index.
# This avoids the huge default CUDA wheels from PyPI (~500MB+) and keeps the
# image small. Long timeout + retries so slow/interrupted downloads recover.
# Upgrade pip first: the base image's pip is too old and discards valid wheels
# (typing_extensions/Jinja2 name normalization), then fails on sdist build deps
# that the PyTorch index doesn't carry.
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --default-timeout=1000 --retries 10 \
    torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install the rest (open-clip, faiss, fastapi, ...)
COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=1000 --retries 10 -r requirements.txt

# Copy your application code and FAISS data
COPY . .

# Expose the port FastAPI will run on
EXPOSE 7860

# Updated line: point to clip_service instead of main
CMD ["uvicorn", "clip_service:app", "--host", "0.0.0.0", "--port", "7860"]