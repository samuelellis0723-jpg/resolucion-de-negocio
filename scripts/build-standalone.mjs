import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = resolve(fileURLToPath(new URL('..', import.meta.url)));
const paths = {
  template: resolve(rootDirectory, 'src/features/unit-economics/standalone-shell.html'),
  styles: resolve(rootDirectory, 'src/features/unit-economics/standalone.css'),
  model: resolve(rootDirectory, 'src/features/unit-economics/unit-economics-model.js'),
  app: resolve(rootDirectory, 'src/features/unit-economics/standalone-app.js'),
  output: resolve(rootDirectory, 'nivel-2-autonomo.html'),
};

const template = await readFile(paths.template, 'utf8');
const contents = {
  '<!-- STANDALONE_STYLES -->': await readFile(paths.styles, 'utf8'),
  '/* STANDALONE_MODEL */': await readFile(paths.model, 'utf8'),
  '/* STANDALONE_APP */': await readFile(paths.app, 'utf8'),
};
const standaloneHtml = Object.entries(contents).reduce((html, [marker, value]) => html.replace(marker, value), template);
await writeFile(paths.output, standaloneHtml, 'utf8');
console.log(`HTML autónomo generado: ${paths.output}`);
