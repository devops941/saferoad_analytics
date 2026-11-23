"""
ASGI entrypoint alias to allow both 'uvicorn app.main:app' and 'uvicorn main:app'.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from main import app, root

__all__ = ["app", "root"]
