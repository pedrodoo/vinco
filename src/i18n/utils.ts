import pt from './pt.json';
import en from './en.json';

const translations = { pt, en } as const;

export type Locale = keyof typeof translations;

export function useTranslations(locale: Locale) {
  return translations[locale];
}

export function getNavLinks(locale: Locale) {
  const base = locale === 'en' ? '/en' : '';
  return {
    home: `${base}/`,
    work: `${base}/work`,
    whatWeDo: `${base}/what-we-do`,
    about: `${base}/about`,
    contact: `${base}/contact`,
  };
}