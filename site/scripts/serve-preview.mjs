// A foreground server lets Playwright own and stop its preview process.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../dist/", import.meta.url));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};
createServer(async (req, res) => {
  try {
    let file = resolve(
      root,
      "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
    );
    if (
      !file.startsWith(root.endsWith(sep) ? root : root + sep) &&
      file !== resolve(root)
    ) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    res.setHeader(
      "Content-Type",
      types[extname(file)] || "application/octet-stream",
    );
    const data = await readFile(file);
    res.setHeader("Content-Length", data.length);
    if (extname(file) === ".mp4") {
      res.setHeader("Accept-Ranges", "bytes");
      if (req.headers.range) {
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        const start = range?.[1]
          ? Number(range[1])
          : Math.max(0, data.length - Number(range?.[2]));
        const end =
          range?.[1] && range[2]
            ? Math.min(Number(range[2]), data.length - 1)
            : data.length - 1;
        if (
          !range ||
          (!range[1] && !range[2]) ||
          start > end ||
          start >= data.length
        ) {
          res
            .writeHead(416, {
              "Content-Range": `bytes */${data.length}`,
              "Content-Length": 0,
            })
            .end();
          return;
        }
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${data.length}`,
          "Content-Length": end - start + 1,
        });
        res.end(
          req.method === "HEAD" ? undefined : data.subarray(start, end + 1),
        );
        return;
      }
    }
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res
      .writeHead(404, { "Content-Type": "text/html" })
      .end(await readFile(resolve(root, "404.html")));
  }
}).listen(4321, "127.0.0.1", () =>
  console.log("Preview: http://127.0.0.1:4321"),
);
