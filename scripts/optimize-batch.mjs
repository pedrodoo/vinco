import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const incomingRoot = path.join(rootDir, '_incoming');
const assetsRoot = path.join(rootDir, 'src', 'assets');
const slugMapPath = path.join(__dirname, 'image-slug-map.json');

const DEFAULT_MAX_WIDTH = 2400;
const DEFAULT_QUALITY = 82;
const IMAGE_EXT = /\.(jpe?g|png)$/i;

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    maxWidth: DEFAULT_MAX_WIDTH,
    quality: DEFAULT_QUALITY,
    projects: path.join(incomingRoot, 'projetos', 'projetos'),
    categories: path.join(incomingRoot, 'categorias'),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--projects') {
      options.projects = path.resolve(rootDir, argv[i + 1]);
      i += 1;
    } else if (arg === '--categories') {
      options.categories = path.resolve(rootDir, argv[i + 1]);
      i += 1;
    } else if (arg === '--max-width') {
      options.maxWidth = Number(argv[i + 1]);
      i += 1;
    } else if (arg === '--quality') {
      options.quality = Number(argv[i + 1]);
      i += 1;
    }
  }

  return options;
}

async function loadSlugMap() {
  const raw = await readFile(slugMapPath, 'utf8');
  return JSON.parse(raw);
}

async function walkImages(dir) {
  const results = [];
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === '.DS_Store') continue;

    if (entry.isDirectory()) {
      results.push(...(await walkImages(fullPath)));
    } else if (IMAGE_EXT.test(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

function mapFolderName(name, map) {
  const key = slugify(name);
  return map[key] ?? map[name] ?? key;
}

function scoreProjectImage(filePath) {
  const base = path.basename(filePath);
  let score = 0;
  if (/\.jpe?g$/i.test(base)) score += 10;
  if (!/chatgpt/i.test(base)) score += 20;
  if (/produto|dscf|stf-|oceanario|lx3/i.test(base)) score += 5;
  if (/^_[a-z]/i.test(base)) score += 3;
  return score;
}

function buildCategoryName(filePath, categoryDir, clientMap) {
  const relative = path.relative(categoryDir, filePath);
  const parts = relative.split(path.sep);
  const fileName = parts.pop() ?? '';
  const fileBase = path.basename(fileName, path.extname(fileName));
  const folders = parts.map((part) => {
    const mapped = clientMap[part];
    return mapped ? mapped : slugify(part);
  });

  const descriptor = slugify(fileBase) || 'image';
  const prefix = folders.filter(Boolean).join('-');
  return prefix ? `${prefix}-${descriptor}` : descriptor;
}

async function optimizeToJpeg(sourcePath, outputPath, options) {
  const sourceStats = await stat(sourcePath);
  await mkdir(path.dirname(outputPath), { recursive: true });

  if (options.dryRun) {
    return { sourceStats, outputStats: null, outputPath };
  }

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: options.maxWidth,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .jpeg({
      quality: options.quality,
      mozjpeg: true,
    })
    .toFile(outputPath);

  const outputStats = await stat(outputPath);
  return { sourceStats, outputStats, outputPath };
}

async function processProjects(projectsDir, slugMap, options, manifest) {
  const projectMap = slugMap.projects ?? {};
  const outputs = [];
  let projectDirs;

  try {
    projectDirs = await readdir(projectsDir, { withFileTypes: true });
  } catch {
    console.warn(`Projects folder not found: ${projectsDir}`);
    return outputs;
  }

  for (const entry of projectDirs.filter((e) => e.isDirectory())) {
    const projectSlug = mapFolderName(entry.name, projectMap);
    const projectDir = path.join(projectsDir, entry.name);
    const images = (await walkImages(projectDir)).sort((a, b) => {
      const scoreDiff = scoreProjectImage(b) - scoreProjectImage(a);
      if (scoreDiff !== 0) return scoreDiff;
      return a.localeCompare(b);
    });

    if (images.length === 0) continue;

    const outDir = path.join(assetsRoot, 'projects', projectSlug);
    const usedNames = new Set();

    for (let i = 0; i < images.length; i += 1) {
      const source = images[i];
      let fileName;

      if (i === 0) {
        fileName = 'hero.jpg';
      } else {
        const base = slugify(path.basename(source, path.extname(source))) || `image-${i}`;
        fileName = `gallery-${String(i).padStart(2, '0')}-${base}.jpg`;
      }

      if (usedNames.has(fileName)) continue;
      usedNames.add(fileName);

      const outputPath = path.join(outDir, fileName);
      const result = await optimizeToJpeg(source, outputPath, options);
      const rel = path.relative(assetsRoot, outputPath).replace(/\\/g, '/');

      outputs.push({ type: 'project', slug: projectSlug, rel, source });
      manifest.push({
        path: rel,
        type: 'project',
        project: projectSlug,
        source: path.relative(rootDir, source).replace(/\\/g, '/'),
      });

      const srcRel = path.relative(rootDir, source);
      if (options.dryRun) {
        console.log(`[dry-run] ${srcRel} → src/assets/${rel}`);
      } else {
        console.log(`✓ ${srcRel}`);
        console.log(`  → src/assets/${rel}`);
        console.log(`  ${formatBytes(result.sourceStats.size)} → ${formatBytes(result.outputStats.size)}`);
      }
    }
  }

  return outputs;
}

async function processCategories(categoriesDir, slugMap, options, manifest) {
  const categoryMap = slugMap.categories ?? {};
  const clientMap = slugMap.clients ?? {};
  const outputs = [];
  let categoryDirs;

  try {
    categoryDirs = await readdir(categoriesDir, { withFileTypes: true });
  } catch {
    console.warn(`Categories folder not found: ${categoriesDir}`);
    return outputs;
  }

  for (const entry of categoryDirs.filter((e) => e.isDirectory())) {
    const categorySlug = mapFolderName(entry.name, categoryMap);
    const categoryDir = path.join(categoriesDir, entry.name);
    const images = (await walkImages(categoryDir)).sort((a, b) => a.localeCompare(b));

    if (images.length === 0) continue;

    const outDir = path.join(assetsRoot, 'categories', categorySlug);
    const usedNames = new Map();

    for (const source of images) {
      let baseName = buildCategoryName(source, categoryDir, clientMap);
      const count = (usedNames.get(baseName) ?? 0) + 1;
      usedNames.set(baseName, count);

      if (count > 1) baseName = `${baseName}-${String(count).padStart(2, '0')}`;
      const fileName = `${baseName}.jpg`;
      const outputPath = path.join(outDir, fileName);
      const result = await optimizeToJpeg(source, outputPath, options);
      const rel = path.relative(assetsRoot, outputPath).replace(/\\/g, '/');

      outputs.push({ type: 'category', slug: categorySlug, rel, source });
      manifest.push({
        path: rel,
        type: 'category',
        category: categorySlug,
        source: path.relative(rootDir, source).replace(/\\/g, '/'),
      });

      const srcRel = path.relative(rootDir, source);
      if (options.dryRun) {
        console.log(`[dry-run] ${srcRel} → src/assets/${rel}`);
      } else {
        console.log(`✓ ${srcRel}`);
        console.log(`  → src/assets/${rel}`);
        console.log(`  ${formatBytes(result.sourceStats.size)} → ${formatBytes(result.outputStats.size)}`);
      }
    }
  }

  return outputs;
}

function humanizeSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function buildAltDraft(manifest) {
  const lines = ['export const imageAlt: Record<string, { pt: string; en: string }> = {'];

  for (const item of manifest) {
    const label = humanizeSlug(path.basename(item.path, '.jpg'));
    const context =
      item.type === 'project'
        ? humanizeSlug(item.project)
        : `${humanizeSlug(item.category)} — ${label}`;

    lines.push(`  '${item.path}': {`);
    lines.push(`    pt: '${context.replace(/'/g, "\\'")}',`);
    lines.push(`    en: '${context.replace(/'/g, "\\'")}',`);
    lines.push('  },');
  }

  lines.push('};');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const slugMap = await loadSlugMap();
  const manifest = [];

  console.log(options.dryRun ? 'Dry-run mode — no files written\n' : 'Optimizing images...\n');

  if (!options.dryRun) {
    await mkdir(path.join(assetsRoot, 'projects'), { recursive: true });
    await mkdir(path.join(assetsRoot, 'categories'), { recursive: true });
  }

  await processProjects(options.projects, slugMap, options, manifest);
  console.log('');
  await processCategories(options.categories, slugMap, options, manifest);

  const draft = buildAltDraft(manifest);

  if (!options.dryRun) {
    await writeFile(path.join(rootDir, 'scripts', 'image-alt-draft.ts'), draft, 'utf8');
    await writeFile(
      path.join(rootDir, 'public', 'images-manifest.json'),
      JSON.stringify({ generatedAt: new Date().toISOString(), images: manifest }, null, 2),
      'utf8',
    );
  }

  console.log(`\n${manifest.length} images processed.`);
  if (!options.dryRun) {
    console.log('Alt draft: scripts/image-alt-draft.ts');
    console.log('Manifest: public/images-manifest.json');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
