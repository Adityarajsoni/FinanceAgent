#!/usr/bin/env bash
# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Install Playwright and browsers
python -m playwright install --with-deps
