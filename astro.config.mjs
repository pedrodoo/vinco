// @ts-check
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pageLastmod = JSON.parse(
  readFileSync(path.join(__dirname, 'src/data/page-lastmod.json'), 'utf8'),
);

function normalizeSitemapPath(pathname) {
  if (pathname === '/en') return '/en/';
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default defineConfig({
  site: 'https://vinco-studio.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        const lookupPath = normalizeSitemapPath(pathname);
        const isHome = lookupPath === '/' || lookupPath === '/en/';
        const isProject = lookupPath.startsWith('/projetos/') || lookupPath.startsWith('/en/projects/');

        return {
          ...item,
          lastmod: pageLastmod[pathname] ?? pageLastmod[lookupPath] ?? new Date().toISOString(),
          changefreq: isHome ? 'weekly' : 'monthly',
          priority: isHome ? 1.0 : isProject ? 0.8 : 0.7,
        };
      },
    }),
  ],
  redirects: {
    '/en/contacts': '/en/contact',
  },
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale: "pt",
    locales: ["pt", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});