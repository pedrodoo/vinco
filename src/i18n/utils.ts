import pt from './pt.json';
import en from './en.json';
import { getProjectLocalePathPairs } from '../data/work';

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
    work: '/projetos',
    whatWeDo: '/o-que-fazemos',
    about: '/sobre',
    contact: '/contacto',
  },
  en: {
    home: '/en/',
    work: '/en/projects',
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
  ['/projetos', '/en/projects'],
  ['/o-que-fazemos', '/en/what-we-do'],
  ['/sobre', '/en/about'],
  ['/contacto', '/en/contact'],
];

function getAllPathPairs(): [string, string][] {
  return [...pathPairs, ...getProjectLocalePathPairs()];
}

function findPathPair(pathname: string): { pt: string; en: string } | undefined {
  const normalized = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;

  const sortedPairs = getAllPathPairs().sort(
    (a, b) => Math.max(b[0].length, b[1].length) - Math.max(a[0].length, a[1].length),
  );

  for (const [ptPath, enPath] of sortedPairs) {
    const enBase = enPath.replace(/\/$/, '');

    if (normalized === ptPath) {
      return { pt: ptPath, en: enPath };
    }

    if (normalized === enBase || normalized === enPath) {
      return { pt: ptPath, en: enPath };
    }
  }

  return undefined;
}

export function getLocalePaths(pathname: string): { pt: string; en: string } {
  const exactPair = findPathPair(pathname);
  if (exactPair) return exactPair;

  const normalized = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;

  const sortedPairs = getAllPathPairs().sort(
    (a, b) => Math.max(b[0].length, b[1].length) - Math.max(a[0].length, a[1].length),
  );

  for (const [ptPath, enPath] of sortedPairs) {
    const enBase = enPath.replace(/\/$/, '');

    if (normalized === ptPath || normalized.startsWith(`${ptPath}/`)) {
      const suffix = normalized.slice(ptPath.length);
      return {
        pt: `${ptPath}${suffix}` || '/',
        en: `${enBase}${suffix}` || enPath,
      };
    }

    if (normalized === enBase || normalized.startsWith(`${enBase}/`)) {
      const suffix = normalized.slice(enBase.length);
      return {
        pt: `${ptPath}${suffix}` || '/',
        en: `${enBase}${suffix}` || enPath,
      };
    }
  }

  return { pt: '/', en: '/en/' };
}

export function getAlternateLocalePath(pathname: string, locale: Locale): string {
  const paths = getLocalePaths(pathname);
  return locale === 'pt' ? paths.en : paths.pt;
}