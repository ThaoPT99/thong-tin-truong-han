const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.join(__dirname, "..");
const serveBin = path.join(root, "node_modules", "serve", "build", "main.js");
const port = process.env.PORT || "3000";

// Không dùng -s (SPA): mọi 404 sẽ trả index.html → iframe ebook bị vòng lặp vô hạn
const child = spawn(process.execPath, [serveBin, ".", "-l", port], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 1));
