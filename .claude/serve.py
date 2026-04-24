#!/usr/bin/env python3
import os
import sys

os.chdir("/Users/danielvillero/Desktop/Daniel Villero Portfolio 2026")

from http.server import HTTPServer, SimpleHTTPRequestHandler

port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
server = HTTPServer(('', port), SimpleHTTPRequestHandler)
print(f"Serving on port {port}", flush=True)
server.serve_forever()
