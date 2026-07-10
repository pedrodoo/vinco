import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'src', 'assets');
const imageMetaPath = path.join(rootDir, 'src', 'data', 'image-meta.ts');

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(path.relative(assetsDir, fullPath).replace(/\\/g, '/'));
    }
  }

  return files;
}

function extractExplicitKeys(source) {
  const keys = new Set();
  const pattern = /'([^']+)':\s*\{/g;
  let match = pattern.exec(source);

  while (match) {
    keys.add(match[1]);
    match = pattern.exec(source);
  }

  return keys;
}

function isWeakAlt(text) {
  return /chatgpt|dscf|img-\d|mg-\d|shooting-/i.test(text);
}

async function main() {
  const [images, imageMetaSource] = await Promise.all([
    walk(assetsDir),
    readFile(imageMetaPath, 'utf8'),
  ]);

  const explicitKeys = extractExplicitKeys(imageMetaSource);
  const missing = images.filter((assetPath) => !explicitKeys.has(assetPath));
  const weak = images.filter((assetPath) => {
    if (explicitKeys.has(assetPath)) return false;
    const filename = assetPath.split('/').pop() ?? '';
    return isWeakAlt(filename);
  });

  console.log(`Images scanned: ${images.length}`);
  console.log(`Explicit alt entries: ${explicitKeys.size}`);
  console.log(`Missing explicit alt: ${missing.length}`);

  if (missing.length > 0) {
    console.log('\nMissing explicit alt entries:');
    for (const assetPath of missing.sort()) {
      console.log(`- ${assetPath}`);
    }
  }

  if (weak.length > 0) {
    console.log('\nLikely weak fallback filenames:');
    for (const assetPath of weak.sort()) {
      console.log(`- ${assetPath}`);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
