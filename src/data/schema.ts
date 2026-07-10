import { getNavLinks, useTranslations, type Locale } from '../i18n/utils';
import { SITE_URL } from '../config/site';
import {
  getProjectPath,
  type Project,
} from './work';

const SITE = SITE_URL;
const ORGANIZATION_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const FOUNDER_ID = `${SITE}/#founder`;

type JsonLd = Record<string, unknown>;

function pageUrl(path: string): string {
  const normalized = path === '/' ? '/' : path.replace(/\/?$/, '/');
  return new URL(normalized, SITE).href;
}

function siteName(locale: Locale): string {
  return locale === 'pt' ? 'Vinco Estúdio' : 'Vinco Studio';
}

function organizationDescription(locale: Locale): string {
  return locale === 'pt'
    ? 'Estúdio de desenvolvimento de produto end-to-end.'
    : 'End-to-end product development studio.';
}

function projectPeriodYear(period: Project['period']): string | undefined {
  switch (period.type) {
    case 'single':
      return period.year;
    case 'since':
      return period.year;
    case 'range':
      return period.from;
  }
}

export function getOrganizationSchema(locale: Locale): JsonLd {
  const t = useTranslations(locale);
  const name = siteName(locale);

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORGANIZATION_ID,
    name,
    alternateName: locale === 'pt' ? 'Vinco Studio' : 'Vinco Estúdio',
    url: SITE,
    logo: `${SITE}/images/logo-vertical.png`,
    description: organizationDescription(locale),
    email: t.footer.email,
    foundingDate: '2026',
    areaServed: [
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Place', name: 'Europe' },
    ],
    knowsAbout: [
      'Product development',
      'Merchandising',
      'Apparel',
      'Brand development',
      'Sourcing',
      'Production management',
    ],
    sameAs: [t.footer.social.instagram, t.footer.social.linkedin],
    contactPoint: {
      '@type': 'ContactPoint',
      email: t.footer.email,
      contactType: 'customer service',
      availableLanguage: ['Portuguese', 'English'],
    },
  };
}

export function getWebsiteSchema(locale: Locale): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE,
    name: siteName(locale),
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: locale === 'pt' ? 'pt-PT' : 'en',
  };
}

export function getHomePageSchemas(locale: Locale): JsonLd[] {
  return [getOrganizationSchema(locale), getWebsiteSchema(locale)];
}

export function getContactPageSchemas(locale: Locale): JsonLd[] {
  const t = useTranslations(locale);
  const nav = getNavLinks(locale);

  return [
    getOrganizationSchema(locale),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: t.contact.title,
      url: pageUrl(nav.contact),
      description: t.contact.meta_description,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': ORGANIZATION_ID },
    },
  ];
}

export function getAboutPageSchemas(locale: Locale, founderImageUrl?: string): JsonLd[] {
  const t = useTranslations(locale);
  const nav = getNavLinks(locale);

  const founder: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: t.about.founder_name,
    jobTitle: t.about.founder_role,
    worksFor: { '@id': ORGANIZATION_ID },
    description: t.about.founder_bio.split('\n\n')[0],
  };

  if (founderImageUrl) {
    founder.image = founderImageUrl;
  }

  return [
    getOrganizationSchema(locale),
    founder,
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: t.about.title,
      url: pageUrl(nav.about),
      description: t.about.meta_description,
      isPartOf: { '@id': WEBSITE_ID },
      about: [{ '@id': ORGANIZATION_ID }, { '@id': FOUNDER_ID }],
    },
  ];
}

export function getProjectsPageSchemas(
  locale: Locale,
  items: { name: string; path: string }[],
): JsonLd[] {
  const t = useTranslations(locale);
  const nav = getNavLinks(locale);

  return [
    getOrganizationSchema(locale),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: t.work.title,
      url: pageUrl(nav.work),
      description: t.work.meta_description,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
      mainEntity: {
        '@type': 'ItemList',
        name: t.work.title,
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          url: pageUrl(item.path),
        })),
      },
    },
  ];
}

export function getProjectPageSchemas(
  locale: Locale,
  project: Project,
  title: string,
  description: string,
  heroImageUrl?: string,
): JsonLd[] {
  const summary = description.replace(/\s+/g, ' ').trim().slice(0, 300);
  const projectPath = getProjectPath(project.slug, locale);
  const dateCreated = projectPeriodYear(project.period);

  const creativeWork: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: summary,
    url: pageUrl(projectPath),
    creator: { '@id': ORGANIZATION_ID },
    about: {
      '@type': 'Organization',
      name: project.client,
    },
    inLanguage: locale === 'pt' ? 'pt-PT' : 'en',
    isPartOf: { '@id': WEBSITE_ID },
  };

  if (heroImageUrl) {
    creativeWork.image = heroImageUrl;
  }

  if (dateCreated) {
    creativeWork.dateCreated = dateCreated;
  }

  return [getOrganizationSchema(locale), creativeWork];
}

export function getWhatWeDoPageSchemas(locale: Locale): JsonLd[] {
  const t = useTranslations(locale);
  const nav = getNavLinks(locale);

  return [
    getOrganizationSchema(locale),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: t.home.categories_title,
      url: pageUrl(nav.whatWeDo),
      description: t.work.categories_meta_description,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
    },
  ];
}
