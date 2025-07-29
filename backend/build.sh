#!/bin/bash
set -o errexit  # Exit on error

echo "🚀 Installing Python dependencies..."
pip install -r requirements.txt

echo "🎭 Installing Playwright browsers..."
python -m playwright install chromium

echo "🔧 Installing system dependencies for Playwright..."
python -m playwright install-deps chromium || echo "⚠️ Could not install system deps, continuing anyway..."

echo "✅ Build completed successfully!"