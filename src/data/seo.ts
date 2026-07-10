import type { ImageMetadata } from 'astro';
import { useTranslations, type Locale } from '../i18n/utils';
import { getCaseStudyCopyKey } from './work';
import brandOgImage from '../assets/og/og-brand.jpg';

export type PageKey = 'home' | 'work' | 'whatWeDo' | 'about' | 'contact' | 'project';

export function sanitizeMetaDescription(description: string): string {
  return description.replace(/\s+/g, ' ').trim();
}

export function getPageSeo(locale: Locale, page: PageKey, projectSlug?: string) {
  const t = useTranslations(locale);

  if (page === 'project' && projectSlug) {
    const copyKey = getCaseStudyCopyKey(projectSlug);
    const caseCopy = copyKey ? t.work.cases[copyKey as keyof typeof t.work.cases] : undefined;

    return {
      title: caseCopy?.meta_title ?? caseCopy?.title ?? projectSlug,
      description: sanitizeMetaDescription(caseCopy?.meta_description ?? ''),
    };
  }

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
        title: t.work.categories_meta_title,
        description: sanitizeMetaDescription(t.work.categories_meta_description),
      };
    case 'about':
      return {
        title: t.about.meta_title,
        description: sanitizeMetaDescription(t.about.meta_description),
      };
    case 'contact':
      return {
        title: t.contact.meta_title,
        description: sanitizeMetaDescription(t.contact.meta_description),
      };
    default:
      return {
        title: t.home.meta_title,
        description: sanitizeMetaDescription(t.home.meta_description),
      };
  }
}

export function getBrandOgImage(): ImageMetadata {
  return brandOgImage;
}
