# Use a slim Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your application code and FAISS data
COPY . .

# Expose the port FastAPI will run on
EXPOSE 7860

# Updated line: point to clip_service instead of main
CMD ["uvicorn", "clip_service:app", "--host", "0.0.0.0", "--port", "7860"]