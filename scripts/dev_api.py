# Local stand-in for Vercel's Python runtime: serves api/scrape.py on :8787.
# Vite proxies /api to it during `npm run dev` (see vite.config.ts).
#   pip install -r requirements.txt
#   python scripts/dev_api.py
import os
import sys
from http.server import ThreadingHTTPServer

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "api"))
from scrape import handler  # noqa: E402

if __name__ == "__main__":
    print("Lead finder API on http://localhost:8787/api/scrape?url=...")
    ThreadingHTTPServer(("127.0.0.1", 8787), handler).serve_forever()
