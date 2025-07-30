# Use official Playwright + Python image
FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

WORKDIR /app

# Copy dependencies first
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project files
COPY . .

# Expose port (optional, Railway overrides it anyway)
EXPOSE 8000

# Run Gunicorn on dynamic port
CMD gunicorn app:app --bind 0.0.0.0:$PORT
