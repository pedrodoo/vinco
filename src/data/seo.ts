import type { ImageMetadata } from 'astro';
import { siteName } from '../config/site';
import { useTranslations, type Locale } from '../i18n/utils';
import brandOgImage from '../assets/og/og-brand.jpg';

export type PageKey = 'home' | 'work' | 'whatWeDo' | 'about' | 'contact';

export function sanitizeMetaDescription(description: string): string {
  return description.replace(/\s+/g, ' ').trim();
}

export function getPageSeo(locale: Locale, page: PageKey) {
  const t = useTranslations(locale);
  const name = siteName(locale);

  switch (page) {
    case 'home':
      return {
        title: t.home.meta_title,
        description: sanitizeMetaDescription(t.home.meta_description),
      };
    case 'work':
      return {
        title: t.work.meta_title,
        description: sanitizeMetaDescription(t.work.meta_description),
      };
    case 'whatWeDo':
      return {
        title: `${t.home.categories_title} | ${name}`,
        description: sanitizeMetaDescription(t.work.categories_meta_description),
      };
    case 'about':
      return {
        title: `${t.about.title} | ${name}`,
        description: sanitizeMetaDescription(t.about.meta_description),
      };
    case 'contact':
      return {
        title: `${t.contact.title} | ${name}`,
        description: sanitizeMetaDescription(t.contact.meta_description),
      };
  }
}

export function getBrandOgImage(): ImageMetadata {
  return brandOgImage;
}
