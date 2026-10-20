// Compile only the imported server modules into a disposable test directory.
// This exercises the actual handlers without a Next server or paid provider requests.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const repo = path.resolve(__dirname, "../..");
const app = path.join(repo, "nextjs");
const ts = require(path.join(app, "node_modules/typescript"));
const output = path.join(app, ".next/integration-check");
for (const dir of ["lib/poetry-gem", "app/api/poetry-gem", "lib/custom-chatbot", "lib/ensemble", "app/api/submit"]) {
  for (const name of fs.readdirSync(path.join(app, dir), { recursive: true })) {
    if (!name.endsWith(".ts")) continue;
    const source = path.join(app, dir, name);
    const target = path.join(output, dir, name.replace(/\.ts$/, ".mjs"));
    let code = ts.transpileModule(fs.readFileSync(source, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
      fileName: source,
    }).outputText;
    code = code.replace(/from "(@\/[^"]+|\.\.?\/[^"]+)"/g, (_, specifier) => {
      let resolved = specifier.startsWith("@/")
        ? path.relative(path.dirname(target), path.join(output, specifier.slice(2)))
        : specifier;
      if (!resolved.startsWith(".")) resolved = "./" + resolved;
      return `from "${resolved}.mjs"`;
    });
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, code);
  }
}
const result = spawnSync(process.execPath, [
  "--conditions=react-server", "--test", path.join(repo, "integration/poetry.test.mjs"),
], { cwd: app, stdio: "inherit" });
process.exitCode = result.status ?? 1;
