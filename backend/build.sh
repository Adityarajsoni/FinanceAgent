#!/bin/bash
set -o errexit

echo "🚀 Upgrading pip..."
pip install --upgrade pip

echo "🚀 Installing dependencies..."
pip install -r requirements.txt

echo "🎭 Installing Playwright browsers..."
python -m playwright install chromium

echo "🔧 Installing Playwright system dependencies..."
python -m playwright install-deps chromium || true

echo "✅ Build completed!"
