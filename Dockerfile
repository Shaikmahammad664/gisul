FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend-fastapi/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend-fastapi/app ./app
COPY backend-fastapi/main.py .
COPY backend-fastapi/.env .env

# Expose port
EXPOSE 5000

# Run the app
CMD ["python", "main.py"]
