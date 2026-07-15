import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const nextBin = resolve(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);
const nodeBin = resolve(
  projectRoot,
  "node_modules",
  "node",
  "bin",
  "node",
);
const outDir = resolve(projectRoot, "out");
const docsDir = resolve(projectRoot, "docs");
const apiDir = resolve(projectRoot, "src", "app", "api");
const apiDirDisabled = resolve(projectRoot, "src", "app", "__api-disabled-for-export__");

async function run() {
  await rm(outDir, { recursive: true, force: true });
  await rm(docsDir, { recursive: true, force: true });

  let apiMoved = false;

  try {
    try {
      await rm(apiDirDisabled, { recursive: true, force: true });
      await cp(apiDir, apiDirDisabled, { recursive: true });
      await rm(apiDir, { recursive: true, force: true });
      apiMoved = true;
    } catch (error) {
      if (error && error.code !== "ENOENT") {
        throw error;
      }
    }

    await new Promise((resolveBuild, rejectBuild) => {
      const buildProcess = spawn(nodeBin, [nextBin, "build", "--webpack"], {
        cwd: projectRoot,
        stdio: "inherit",
        env: {
          ...process.env,
          GITHUB_PAGES: "true",
          GITHUB_PAGES_REPOSITORY:
            process.env.GITHUB_PAGES_REPOSITORY ?? "the-choiser",
          NEXT_PUBLIC_TABWHO_ROOM_ENABLED: "false",
        },
      });

      buildProcess.on("exit", (code) => {
        if (code === 0) {
          resolveBuild();
          return;
        }

        rejectBuild(new Error(`GitHub Pages export failed with code ${code}`));
      });
    });

    await mkdir(docsDir, { recursive: true });
    await cp(outDir, docsDir, { recursive: true });
    await writeFile(resolve(docsDir, ".nojekyll"), "");
  } finally {
    if (apiMoved) {
      await cp(apiDirDisabled, apiDir, { recursive: true });
      await rm(apiDirDisabled, { recursive: true, force: true });
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
