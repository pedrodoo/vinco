import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { pdf } from 'pdf-to-img';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const categoriesRoot = path.join(rootDir, 'src', 'assets', 'categories');

const MAX_WIDTH = 1200;
const QUALITY = 82;

async function collectPdfFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectPdfFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function needsRegeneration(pdfPath, previewPath) {
  try {
    const [pdfStat, previewStat] = await Promise.all([stat(pdfPath), stat(previewPath)]);
    return pdfStat.mtimeMs > previewStat.mtimeMs;
  } catch {
    return true;
  }
}

async function generatePreview(pdfPath) {
  const dir = path.dirname(pdfPath);
  const basename = path.basename(pdfPath, path.extname(pdfPath));
  const previewPath = path.join(dir, `${basename}.preview.jpg`);

  if (!(await needsRegeneration(pdfPath, previewPath))) {
    console.log(`skip  ${path.relative(rootDir, previewPath)} (up to date)`);
    return;
  }

  const document = await pdf(pdfPath, { scale: 2 });
  let firstPage = null;

  for await (const page of document) {
    firstPage = page;
    break;
  }

  if (!firstPage) {
    console.warn(`warn  no pages in ${path.relative(rootDir, pdfPath)}`);
    return;
  }

  await sharp(firstPage)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(previewPath);

  console.log(`write ${path.relative(rootDir, previewPath)}`);
}

const pdfFiles = await collectPdfFiles(categoriesRoot);

if (pdfFiles.length === 0) {
  console.log('no PDFs found in src/assets/categories');
} else {
  for (const pdfPath of pdfFiles.sort()) {
    await generatePreview(pdfPath);
  }
}
