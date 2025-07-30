# ✅ Use updated Playwright version
FROM mcr.microsoft.com/playwright/python:v1.54.0-jammy

WORKDIR /app

# Copy dependencies first
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# ✅ Install Playwright browsers
RUN python -m playwright install --with-deps chromium

# Copy project files
COPY . .

EXPOSE 8000

CMD gunicorn app:app --bind 0.0.0.0:$PORT
