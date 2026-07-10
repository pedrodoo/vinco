import type { Locale } from '../i18n/utils';

export const SITE_URL = 'https://vinco-studio.com';

export function siteName(locale: Locale): string {
  return locale === 'pt' ? 'Vinco Estúdio' : 'Vinco Studio';
}

export function ogLocale(locale: Locale): string {
  return locale === 'pt' ? 'pt_PT' : 'en_US';
}

export function hreflangCode(locale: Locale): string {
  return locale === 'pt' ? 'pt-PT' : 'en';
}
