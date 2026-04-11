import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const docsDir = resolve(projectRoot, "docs");
const basePath = `/${
  (process.env.GITHUB_PAGES_REPOSITORY ?? "the-choiser").replace(
    /^\/+|\/+$/g,
    "",
  ) || "the-choiser"
}`;
const host = process.env.HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "4173", 10);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function contentTypeFor(pathname) {
  return contentTypes[extname(pathname)] ?? "application/octet-stream";
}

async function readFromDocs(relativePath) {
  const normalized = relativePath.replace(/^\/+/, "");

  const candidates =
    normalized === ""
      ? ["index.html", "index.txt"]
      : normalized.endsWith("/")
        ? [`${normalized}index.html`, `${normalized}index.txt`]
        : [
            normalized,
            `${normalized}.html`,
            `${normalized}/index.html`,
            `${normalized}/index.txt`,
          ];

  for (const candidate of candidates) {
    const absolutePath = resolve(docsDir, candidate);

    if (!absolutePath.startsWith(docsDir)) {
      continue;
    }

    try {
      const body = await readFile(absolutePath);
      return { body, filePath: absolutePath };
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === "/" || pathname === "") {
    response.writeHead(302, { Location: `${basePath}/` });
    response.end();
    return;
  }

  if (pathname === basePath) {
    response.writeHead(302, { Location: `${basePath}/` });
    response.end();
    return;
  }

  if (!pathname.startsWith(`${basePath}/`)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Use ${basePath}/ to preview the GitHub Pages build.`);
    return;
  }

  const relativePath = pathname.slice(basePath.length + 1);
  const file = await readFromDocs(relativePath);

  if (!file) {
    const fallback = await readFromDocs("404.html");

    response.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(fallback?.body ?? "404");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypeFor(file.filePath),
    "Cache-Control": "no-store",
  });
  response.end(file.body);
});

server.listen(port, host, () => {
  console.log(
    `GitHub Pages preview ready at http://${host}:${port}${basePath}/`,
  );
});
