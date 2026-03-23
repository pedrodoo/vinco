import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const copyPath = path.join(rootDir, 'src', 'i18n', 'copy.md');
const ptPath = path.join(rootDir, 'src', 'i18n', 'pt.json');
const enPath = path.join(rootDir, 'src', 'i18n', 'en.json');

function parseTableRow(line) {
  if (!line.trim().startsWith('|') || !line.trim().endsWith('|')) {
    return null;
  }

  const columns = line
    .split('|')
    .slice(1, -1)
    .map((column) => column.trim());

  if (columns.length !== 3) {
    return null;
  }

  return {
    key: columns[0],
    pt: columns[1],
    en: columns[2],
  };
}

function setByDottedPath(target, dottedKey, value) {
  const segments = dottedKey.split('.');
  let cursor = target;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const isLeaf = index === segments.length - 1;

    if (!segment) {
      throw new Error(`Invalid empty segment in key "${dottedKey}".`);
    }

    if (isLeaf) {
      cursor[segment] = value;
      return;
    }

    const existing = cursor[segment];
    if (existing === undefined) {
      cursor[segment] = {};
    } else if (typeof existing !== 'object' || existing === null || Array.isArray(existing)) {
      throw new Error(`Cannot nest key "${dottedKey}" because "${segment}" is not an object.`);
    }

    cursor = cursor[segment];
  }
}

async function main() {
  const markdown = await readFile(copyPath, 'utf8');
  const lines = markdown.split(/\r?\n/);

  const dataRows = [];
  for (const line of lines) {
    const row = parseTableRow(line);
    if (!row) {
      continue;
    }

    const isHeader = row.key === 'key' && row.pt === 'pt' && row.en === 'en';
    const isSeparator = /^-+$/.test(row.key) && /^-+$/.test(row.pt) && /^-+$/.test(row.en);
    if (isHeader || isSeparator) {
      continue;
    }

    dataRows.push(row);
  }

  if (dataRows.length === 0) {
    throw new Error('No translation rows found in src/i18n/copy.md.');
  }

  const ptJson = {};
  const enJson = {};
  const seenKeys = new Set();

  for (const row of dataRows) {
    if (!row.key) {
      throw new Error('Found a row with an empty key.');
    }

    if (seenKeys.has(row.key)) {
      throw new Error(`Duplicate translation key "${row.key}".`);
    }

    if (!row.pt) {
      throw new Error(`Missing PT value for key "${row.key}".`);
    }

    if (!row.en) {
      throw new Error(`Missing EN value for key "${row.key}".`);
    }

    seenKeys.add(row.key);
    setByDottedPath(ptJson, row.key, row.pt);
    setByDottedPath(enJson, row.key, row.en);
  }

  await writeFile(ptPath, `${JSON.stringify(ptJson, null, 2)}\n`, 'utf8');
  await writeFile(enPath, `${JSON.stringify(enJson, null, 2)}\n`, 'utf8');

  console.log(`Synced ${dataRows.length} translation keys from src/i18n/copy.md`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
