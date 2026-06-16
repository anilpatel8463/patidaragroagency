import os
import sys

# Add the parent directory to the path so we can import the 'app' package
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.main import app

# This is required for Vercel to pick up the app
handler = app
