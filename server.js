#!/usr/bin/env node
/* ============================================================
   Signage Desk — sync server.
   Node 18+, no dependencies.

     node server.js            → http://localhost:8080
     PORT=9000 node server.js

   Serves the admin desk, every /display/<id> page, stores the
   published state and the uploaded media, and pushes changes to
   connected screens over Server-Sent Events.
   ============================================================ */
const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const DATA = path.join(ROOT, "data");
const MEDIA = path.join(DATA, "media");
const STATE_FILE = path.join(DATA, "state.json");
const INDEX = path.join(ROOT, "index.html");
const MAX_UPLOAD = 2 * 1024 * 1024 * 1024;   // 2 GB per file

fs.mkdirSync(MEDIA, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".webm": "video/webm",
  ".mov": "video/quicktime", ".ico": "image/x-icon"
};
const EXT_OF = {
  "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/gif": ".gif",
  "image/svg+xml": ".svg", "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov"
};

/* ---------- SSE bus ---------- */
const clients = new Set();
function broadcast(msg) {
  const payload = `data: ${JSON.stringify(msg)}\n\n`;
  for (const res of clients) { try { res.write(payload); } catch (e) { clients.delete(res); } }
}
setInterval(() => { for (const res of clients) { try { res.write(": ping\n\n"); } catch (e) { clients.delete(res); } } }, 25000);

/* ---------- helpers ---------- */
const json = (res, code, obj) => {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(body);
};
function readBody(req, limit = MAX_UPLOAD) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) { reject(new Error("too large")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function serveFile(req, res, file) {
  let stat;
  try { stat = await fsp.stat(file); } catch (e) { res.writeHead(404); return res.end("Not found"); }
  const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range;
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m[1] ? parseInt(m[1], 10) : 0;
    let end = m[2] ? parseInt(m[2], 10) : stat.size - 1;
    if (isNaN(start) || start >= stat.size) { res.writeHead(416, { "content-range": `bytes */${stat.size}` }); return res.end(); }
    end = Math.min(end, stat.size - 1);
    res.writeHead(206, {
      "content-type": type,
      "content-length": end - start + 1,
      "content-range": `bytes ${start}-${end}/${stat.size}`,
      "accept-ranges": "bytes"
    });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, {
    "content-type": type,
    "content-length": stat.size,
    "accept-ranges": "bytes",
    "cache-control": file.startsWith(MEDIA) ? "public, max-age=604800" : "no-cache"
  });
  fs.createReadStream(file).pipe(res);
}

/* ---------- routes ---------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));
  const p = decodeURIComponent(url.pathname);

  try {
    if (p === "/api/ping") return json(res, 200, { signage: true, version: 1 });

    if (p === "/api/state" && req.method === "GET") {
      try { return json(res, 200, JSON.parse(await fsp.readFile(STATE_FILE, "utf8"))); }
      catch (e) { return json(res, 200, {}); }
    }

    if (p === "/api/state" && req.method === "POST") {
      const body = await readBody(req, 64 * 1024 * 1024);
      const state = JSON.parse(body.toString("utf8"));
      const tmp = STATE_FILE + ".tmp";
      await fsp.writeFile(tmp, JSON.stringify(state));
      await fsp.rename(tmp, STATE_FILE);
      broadcast({ k: "state", rev: state.rev, from: req.headers["x-client"] || null });
      return json(res, 200, { ok: true, rev: state.rev });
    }

    if (p === "/api/bus" && req.method === "POST") {
      const msg = JSON.parse((await readBody(req, 65536)).toString("utf8"));
      broadcast(msg);
      return json(res, 200, { ok: true });
    }

    if (p === "/api/events") {
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
        "x-accel-buffering": "no"
      });
      res.write("retry: 2000\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }

    if (p === "/api/media" && req.method === "POST") {
      const type = (req.headers["content-type"] || "application/octet-stream").split(";")[0];
      const ext = EXT_OF[type] || path.extname(url.searchParams.get("name") || "").toLowerCase() || ".bin";
      const name = crypto.randomBytes(8).toString("hex") + ext;
      const dest = path.join(MEDIA, name);
      // streamed straight to disk so a two-hour 4K video never sits in memory
      const size = await new Promise((resolve, reject) => {
        const out = fs.createWriteStream(dest);
        let seen = 0;
        req.on("data", (c) => {
          seen += c.length;
          if (seen > MAX_UPLOAD) { req.destroy(); out.destroy(); reject(new Error("file too large")); }
        });
        req.on("error", reject);
        out.on("error", reject);
        out.on("finish", () => resolve(seen));
        req.pipe(out);
      }).catch(async (e) => { await fsp.unlink(dest).catch(() => {}); throw e; });
      return json(res, 200, { url: "/media/" + name, size });
    }

    if (p === "/api/media" && req.method === "DELETE") {
      const target = url.searchParams.get("url") || "";
      const name = path.basename(target);
      if (name && name !== "." && name !== "..") await fsp.unlink(path.join(MEDIA, name)).catch(() => {});
      return json(res, 200, { ok: true });
    }

    if (p.startsWith("/media/")) {
      const name = path.basename(p);
      return serveFile(req, res, path.join(MEDIA, name));
    }

    // every display link resolves to the same app; the page reads the id from the path
    if (/^\/display\/[\w-]+\/?$/.test(p) || p === "/" || p === "/index.html") {
      return serveFile(req, res, INDEX);
    }

    const local = path.join(ROOT, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
    if (local.startsWith(ROOT) && fs.existsSync(local) && fs.statSync(local).isFile()) {
      return serveFile(req, res, local);
    }

    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
  } catch (err) {
    json(res, 500, { error: String(err && err.message || err) });
  }
});

server.listen(PORT, () => {
  const nets = require("os").networkInterfaces();
  const ips = Object.values(nets).flat().filter((n) => n && n.family === "IPv4" && !n.internal).map((n) => n.address);
  console.log(`Signage Desk running.
  Control desk : http://localhost:${PORT}/${ips.length ? "  ·  http://" + ips[0] + ":" + PORT + "/" : ""}
  Display links: http://${ips[0] || "localhost"}:${PORT}/display/main
                 http://${ips[0] || "localhost"}:${PORT}/display/vertical-1
  Data folder  : ${DATA}`);
});
