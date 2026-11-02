import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { buildAnalystWorkflow } from '../n8n/analyst-workflow-source.mjs';

const modelSource = await readFile(new URL('../src/features/unit-economics/unit-economics-model.js', import.meta.url), 'utf8');
const target = new URL('../n8n/workflows/sol-de-casa-unit-economics-analyst.json', import.meta.url);
await mkdir(new URL('../n8n/workflows/', import.meta.url), { recursive: true });
await writeFile(target, `${JSON.stringify(buildAnalystWorkflow(modelSource), null, 2)}\n`, 'utf8');
console.log('Workflow importable generado desde el contrato y las referencias del modelo existente.');
