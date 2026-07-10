// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vinco-studio.com',
  integrations: [
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        const isHome = path === '/' || path === '/en/' || path === '/en';
        const isProject = path.startsWith('/projetos/') || path.startsWith('/en/projects/');

        return {
          ...item,
          lastmod: new Date().toISOString(),
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