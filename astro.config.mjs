// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vinco-studio.com',
  redirects: {
    '/en/contact': '/en/contacts',
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