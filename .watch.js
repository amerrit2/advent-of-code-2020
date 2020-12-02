const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");

const watcher = chokidar.watch("./**/*.ts");

watcher.on("unlink", async (filePath) => {
  if (filePath.endsWith(".d.ts")) return;

  console.log(`Watcher: unlinked ${filePath}`);
  const parsedPath = path.parse(filePath, ".ts");

  ["d.ts", "js", "d.ts.map", "js.map"].forEach(async (ext) => {
    const buildFile = path.join(parsedPath.dir, `${parsedPath.name}.${ext}`);
    try {
      console.log(`Attempting unlink: ${buildFile}`);
      await fs.promises.unlink(buildFile);
    } catch (e) {
      console.log(`Failed: ${e.message}`);
    }
  });
});
