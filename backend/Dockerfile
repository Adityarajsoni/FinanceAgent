# Use an official Python image with Playwright and Chromium
FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

# Set working directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose port for Render (Render uses $PORT)
EXPOSE 10000

# Start Flask using Gunicorn
CMD gunicorn app:app --bind 0.0.0.0:10000
