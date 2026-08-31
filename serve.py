"""Tiny static dev server with caching disabled.

Usage:  python serve.py [port]   (default port 8000)

- Sends `Cache-Control: no-store` so the browser always fetches the current file.
- Serves Unity WebGL builds: `.br` / `.gz` files get the right Content-Encoding
  and Content-Type so the browser decompresses them natively.
- Multi-threaded so one idle connection can't block the rest.
"""
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

# inner extension -> Content-Type for pre-compressed Unity build files
_UNITY_TYPES = {
    ".js": "application/javascript",
    ".wasm": "application/wasm",
    ".data": "application/octet-stream",
}


class DevHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    _enc = None

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        if self._enc:
            self.send_header("Content-Encoding", self._enc)
            self._enc = None
        super().end_headers()

    def send_head(self):
        p = self.translate_path(self.path)
        self._enc = "br" if p.endswith(".br") else "gzip" if p.endswith(".gz") else None
        return super().send_head()

    def guess_type(self, path):
        p = str(path)
        for enc_ext in (".br", ".gz"):
            if p.endswith(enc_ext):
                inner = p[: -len(enc_ext)]
                for ext, ctype in _UNITY_TYPES.items():
                    if inner.endswith(ext):
                        return ctype
                return "application/octet-stream"
        return super().guess_type(path)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server = ThreadingHTTPServer(("", port), DevHandler)
    server.daemon_threads = True
    print(f"Serving http://localhost:{port}  (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
