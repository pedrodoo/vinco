import pt from './pt.json';
import en from './en.json';

const translations = { pt, en } as const;

export type Locale = keyof typeof translations;

export function useTranslations(locale: Locale) {
  return translations[locale];
}

/** Splits copy on line breaks produced by `\n` in copy.md. */
export function splitCopyLines(text: string): string[] {
  return text.split('\n');
}

/** Splits copy on blank lines produced by `\n\n` in copy.md. */
export function splitCopyParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter(Boolean);
}

const routeMap = {
  pt: {
    home: '/',
    work: '/trabalho',
    workWhatWeDevelop: '/trabalho/o-que-desenvolvemos',
    whatWeDo: '/o-que-fazemos',
    about: '/sobre',
    contact: '/contacto',
  },
  en: {
    home: '/en/',
    work: '/en/work',
    workWhatWeDevelop: '/en/work/what-we-develop',
    whatWeDo: '/en/what-we-do',
    about: '/en/about',
    contact: '/en/contact',
  },
} as const;

export function getNavLinks(locale: Locale) {
  return routeMap[locale];
}

const pathPairs: [string, string][] = [
  ['/', '/en/'],
  ['/trabalho', '/en/work'],
  ['/trabalho/o-que-desenvolvemos', '/en/work/what-we-develop'],
  ['/o-que-fazemos', '/en/what-we-do'],
  ['/sobre', '/en/about'],
  ['/contacto', '/en/contact'],
];

export function getAlternateLocalePath(pathname: string, locale: Locale): string {
  const normalized = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;

  for (const [ptPath, enPath] of pathPairs) {
    if (locale === 'pt') {
      if (normalized === ptPath || normalized.startsWith(`${ptPath}/`)) {
        return normalized.replace(ptPath, enPath.replace(/\/$/, '')) || enPath;
      }
    } else {
      const enBase = enPath.replace(/\/$/, '');
      if (normalized === enBase || normalized.startsWith(`${enBase}/`)) {
        return normalized.replace(enBase, ptPath) || '/';
      }
    }
  }

  return locale === 'pt' ? '/en/' : '/';
}