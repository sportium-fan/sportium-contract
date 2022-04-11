#!/usr/bin/env node

const fs = require("fs");
const prettier = require("prettier");
const camelCase = require("camelcase");

const getDirList = (dirName) =>
  fs
    .readdirSync(dirName, {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const convertCadenceToJs = (content, fName) => {
  const fileName = camelCase(fName);

  const currentFile = content
    .replace(/\"\.\.\/\.\.\/contracts\//g, "0x")
    .replace(/\.cdc\"/g, "")
    .replace(/\`/g, "");
  const code = `export const ${fileName} = \`${currentFile}\`;`;
  return prettier.format(code, { parser: "typescript" });
};

const compileCadenceFile = (kind, dirList) => {
  const pathList = [];
  fs.mkdirSync(kind, { recursive: true });

  console.log(`generating ${kind} typescript file`);

  dirList.forEach((dir) => {
    const path = `${kind}/${dir}`;
    fs.mkdirSync(`./src${camelCase(path)}`, { recursive: true });

    const fileList = fs
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    fileList.forEach((file) => {
      const [fileName, extension] = file.split(".");

      if (extension !== "cdc") {
        console.log(`not cadence file: find extension: ${extension}`);
        return;
      }

      const content = fs.readFileSync(`${path}/${file}`, "utf8");
      const newContent = convertCadenceToJs(content, fileName);

      pathList.push(`./src${camelCase(path)}/${camelCase(fileName)}.ts`);
      fs.writeFileSync(
        `./src${camelCase(path)}/${camelCase(fileName)}.ts`,
        newContent,
        "utf8"
      );
    });
  });
  return pathList;
};

const generateIndexCode = (pathList) => {
  const exportCode = [];

  pathList.forEach((path) => {
    const variable = path.split("/").pop().replace(".ts", "");

    const code = `export {${variable} as ${camelCase(
      `${path.split("/")[3]}_${variable}`
    )}} from "${path.replace("./src", ".").replace(".ts", "")}"`;
    exportCode.push(code);
  });

  const code = prettier.format(exportCode.join("\n"), { parser: "typescript" });
  fs.writeFileSync("./src/index.ts", code, "utf8");
};

(() => {
  fs.rmSync("src", { recursive: true, force: true });
  fs.mkdirSync("src");

  const generateTypescriptCode = (dir) => {
    const dirList = getDirList(dir);
    return compileCadenceFile(dir, dirList);
  };

  const pathList = ["./transactions", "./scripts"]
    .map(generateTypescriptCode)
    .flat();
  generateIndexCode(pathList);
})();
