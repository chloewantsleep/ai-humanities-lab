"""Serve only exported model assets to the existing localhost:3000 browser bench."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parent / "outputs" / "browser-model"
if not (root / "onnx" / "model.onnx").exists():
    raise SystemExit("Run export-onnx.py first.")


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        requested = unquote(urlsplit(self.path).path).lstrip("/")
        path = (root / requested).resolve()
        if not path.is_relative_to(root) or not path.is_file() or path.suffix not in {".json", ".jinja", ".txt", ".onnx", ".onnx_data"}:
            self.send_error(404)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "http://localhost:3000")
        super().end_headers()


print("Model assets only: http://127.0.0.1:8766 (Ctrl-C to stop)", flush=True)
ThreadingHTTPServer(("127.0.0.1", 8766), partial(Handler, directory=str(root))).serve_forever()
