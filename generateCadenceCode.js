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

const convertCadenceToJs = (content, fName, kind) => {
  const fileName = camelCase(fName);

  const currentFile = content
    .replace(/\"\.\.\/\.\.\/contracts\//g, "0x")
    .replace(/\.cdc\"/g, "")
    .replace(/\`/g, "");
  const code = `export const ${camelCase(
    `${fileName}_${kind.replace("./", "")}`
  )} = \`${currentFile}\`;`;
  return prettier.format(code, { parser: "typescript" });
};

const compileCadenceFile = (kind, dirList) => {
  fs.mkdirSync(kind, { recursive: true });

  console.log(`generating ${kind} typescript file`);

  dirList.forEach((dir, index) => {
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
      const newContent = convertCadenceToJs(
        content,
        fileName,
        kind.slice(0, -1)
      );

      fs.writeFileSync(
        `./src/${camelCase(path)}/${camelCase(fileName)}.ts`,
        newContent,
        "utf8"
      );
    });
  });
};

(() => {
  const generate = (dir) => {
    const dirList = getDirList(dir);
    compileCadenceFile(dir, dirList);
  };

  ["./transactions", "./scripts"].map(generate);
})();
