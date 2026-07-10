import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'src', 'data', 'page-lastmod.json');

const SHARED_PROJECT_FILES = [
  'src/pages/projetos/[slug].astro',
  'src/pages/en/projects/[slug].astro',
  'src/components/ProjectPage.astro',
  'src/data/work.ts',
  'src/i18n/copy.md',
];

const ROUTES = [
  { url: '/', files: ['src/pages/index.astro', 'src/i18n/copy.md', 'src/data/seo.ts'] },
  { url: '/contacto', files: ['src/pages/contacto.astro', 'src/components/ContactPage.astro', 'src/i18n/copy.md', 'src/data/seo.ts'] },
  { url: '/en/', files: ['src/pages/en/index.astro', 'src/i18n/copy.md', 'src/data/seo.ts'] },
  { url: '/en/about', files: ['src/pages/en/about.astro', 'src/components/AboutPage.astro', 'src/i18n/copy.md', 'src/data/seo.ts'] },
  { url: '/en/contact', files: ['src/pages/en/contact.astro', 'src/components/ContactPage.astro', 'src/i18n/copy.md', 'src/data/seo.ts'] },
  { url: '/en/projects', files: ['src/pages/en/projects.astro', 'src/i18n/copy.md', 'src/data/seo.ts', 'src/data/work.ts'] },
  { url: '/en/what-we-do', files: ['src/pages/en/what-we-do.astro', 'src/i18n/copy.md', 'src/data/seo.ts'] },
  { url: '/o-que-fazemos', files: ['src/pages/o-que-fazemos.astro', 'src/i18n/copy.md', 'src/data/seo.ts'] },
  { url: '/projetos', files: ['src/pages/projetos.astro', 'src/i18n/copy.md', 'src/data/seo.ts', 'src/data/work.ts'] },
  { url: '/sobre', files: ['src/pages/sobre.astro', 'src/components/AboutPage.astro', 'src/i18n/copy.md', 'src/data/seo.ts'] },
  { url: '/projetos/oceanario-de-lisboa', files: SHARED_PROJECT_FILES },
  { url: '/projetos/fundacao-oceano-azul', files: SHARED_PROJECT_FILES },
  { url: '/projetos/sociedade-francisco-manuel-dos-santos', files: SHARED_PROJECT_FILES },
  { url: '/projetos/seathefuture', files: SHARED_PROJECT_FILES },
  { url: '/projetos/lx3', files: SHARED_PROJECT_FILES },
  { url: '/en/projects/lisbon-oceanarium', files: SHARED_PROJECT_FILES },
  { url: '/en/projects/blue-ocean-foundation', files: SHARED_PROJECT_FILES },
  { url: '/en/projects/sfms', files: SHARED_PROJECT_FILES },
  { url: '/en/projects/seathefuture', files: SHARED_PROJECT_FILES },
  { url: '/en/projects/lx3', files: SHARED_PROJECT_FILES },
];

function getGitLastMod(files) {
  let latest = null;

  for (const file of files) {
    try {
      const result = execSync(`git log -1 --format=%cI -- "${file}"`, {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();

      if (result && (!latest || result > latest)) {
        latest = result;
      }
    } catch {
      // File may not be tracked yet; skip.
    }
  }

  return latest ?? new Date().toISOString();
}

async function main() {
  const pageLastmod = {};

  for (const route of ROUTES) {
    pageLastmod[route.url] = getGitLastMod(route.files);
    if (route.url !== '/' && route.url !== '/en/') {
      pageLastmod[`${route.url}/`] = pageLastmod[route.url];
    }
  }

  await writeFile(outputPath, `${JSON.stringify(pageLastmod, null, 2)}\n`, 'utf8');
  console.log(`Generated ${Object.keys(pageLastmod).length} lastmod entries in src/data/page-lastmod.json`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
