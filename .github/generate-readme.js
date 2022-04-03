const { readdir, writeFile, stat } = require('fs/promises');

const ignore = ['node_modules', '.github', 'utils', 'vite.config.ts'];

let TEMPLATE = `# Learn Cryptography Nodejs

`;

async function main() {
  const obj = await getFilesEndWith('.', 'ts');
  for (const { path, file } of obj) {
    if (path.substring(2) + '.ts' !== file) continue;
    const md = `- [${file}](${path + '/' + file})`;
    TEMPLATE += md + '\n';
  }
  const today = new Date().toISOString().slice(0, 16).replace('T', ' ');
  TEMPLATE += `\n Updated at: ${today}\n`;
  await writeFile('./README.md', TEMPLATE);
}

/**
 * @param {string} path start path
 * @param {string} extension file extension
 * @returns {Promise<{[key: string]: string}>} Promise of a path and file name object.
 */
async function getFilesEndWith(path, extension) {
  const paths = [];
  const files = await readdir(path);
  // alphabetic order
  files.sort((a, b) => a - b);

  // mtime order
  // files.sort(async (a, b) => {
  //   const aStat = await stat(`${path}/${a}`);
  //   const bStat = await stat(`${path}/${b}`);
  //   return aStat.mtime - bStat.mtime;
  // });
  for (const file of files) {
    const filePath = `${path}/${file}`;
    if (ignore.includes(file)) continue;
    const fileStat = await stat(filePath);
    if (fileStat.isFile() && file.endsWith(extension)) {
      paths.push({ path, file });
    } else if (fileStat.isDirectory()) {
      const subFiles = await getFilesEndWith(filePath, extension);
      paths.push(...subFiles);
    }
  }
  return paths;
}

main();
