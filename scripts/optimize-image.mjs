import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputRoot = path.join(rootDir, 'src', 'assets', 'images');

const DEFAULT_MAX_WIDTH = 2400;
const DEFAULT_QUALITY = 82;

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseArgs(argv) {
  const positional = [];
  const options = {
    out: null,
    maxWidth: DEFAULT_MAX_WIDTH,
    quality: DEFAULT_QUALITY,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--out') {
      options.out = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--max-width') {
      options.maxWidth = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === '--quality') {
      options.quality = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (!arg.startsWith('-')) {
      positional.push(arg);
    }
  }

  return { positional, options };
}

function printHelp() {
  console.log(`Usage: pnpm optimize:image <source> [more-sources...] [options]

Optimizes photos on demand into src/assets/images/ for use with OptimizedImage.

Options:
  --out <path>        Output path relative to src/assets/images/ (single source only)
  --max-width <px>    Max width in pixels (default: ${DEFAULT_MAX_WIDTH})
  --quality <0-100>   JPEG quality (default: ${DEFAULT_QUALITY})

Examples:
  pnpm optimize:image "src/assets/ACESSÓRIOS & BIJUTERIA/foto.jpg"
  pnpm optimize:image "src/assets/VESTUÁRIO/_MG_1311.jpg" --out work/oceanario/vestuario-1311
`);
}

function resolveOutputPath(sourcePath, outOption) {
  const ext = '.jpg';
  const basename = path.basename(sourcePath, path.extname(sourcePath));

  if (outOption) {
    const normalized = outOption.replace(/\\/g, '/').replace(/^\//, '');
    return path.join(outputRoot, normalized.endsWith(ext) ? normalized : `${normalized}${ext}`);
  }

  return path.join(outputRoot, `${slugify(basename)}${ext}`);
}

async function optimizeImage(sourcePath, options) {
  const absoluteSource = path.resolve(rootDir, sourcePath);

  if (!absoluteSource.startsWith(rootDir)) {
    throw new Error(`Source must stay inside the project: ${sourcePath}`);
  }

  const sourceStats = await stat(absoluteSource);
  const outputPath = resolveOutputPath(sourcePath, options.out);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const pipeline = sharp(absoluteSource)
    .rotate()
    .resize({
      width: options.maxWidth,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .jpeg({
      quality: options.quality,
      mozjpeg: true,
    });

  await pipeline.toFile(outputPath);

  const outputStats = await stat(outputPath);
  const relativeOutput = path.relative(rootDir, outputPath);

  console.log(`✓ ${path.relative(rootDir, absoluteSource)}`);
  console.log(`  → ${relativeOutput}`);
  console.log(`  ${formatBytes(sourceStats.size)} → ${formatBytes(outputStats.size)}`);

  return relativeOutput;
}

async function main() {
  const { positional, options } = parseArgs(process.argv.slice(2));

  if (options.help || positional.length === 0) {
    printHelp();
    process.exit(options.help ? 0 : 1);
  }

  if (positional.length > 1 && options.out) {
    console.error('Use --out with a single source file.');
    process.exit(1);
  }

  const outputs = [];

  for (const source of positional) {
    outputs.push(await optimizeImage(source, options));
  }

  console.log('\nImport in Astro (adjust ../ depth to your file):');
  for (const output of outputs) {
    const fromSrc = path.relative(path.join(rootDir, 'src'), output).replace(/\\/g, '/');
    console.log(`  import photo from '../${fromSrc}';`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
