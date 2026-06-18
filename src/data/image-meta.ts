import type { Locale } from '../i18n/utils';

/** Bilingual alt text keyed by path relative to src/assets/ */
export const imageAlt: Record<string, { pt: string; en: string }> = {
  'about/fundadora.jpg': {
    pt: 'Retrato da fundadora do Vinco Estúdio',
    en: 'Portrait of the founder of Vinco Studio',
  },
  'projects/oceanario/hero.jpg': {
    pt: 'Merchandising do Oceanário de Lisboa',
    en: 'Oceanário de Lisboa merchandising',
  },
  'projects/fundacao-oceano-azul/hero.jpg': {
    pt: 'Farda institucional da Fundação Oceano Azul',
    en: 'Fundação Oceano Azul institutional uniform',
  },
  'projects/sfms/hero.jpg': {
    pt: 'Gifting institucional da Sociedade Francisco Manuel dos Santos',
    en: 'Sociedade Francisco Manuel dos Santos institutional gifting',
  },
  'projects/seathefuture/hero.jpg': {
    pt: 'Vestuário SEATHEFUTURE',
    en: 'SEATHEFUTURE apparel',
  },
  'projects/lx3/hero.jpg': {
    pt: 'Coleção LX3 — desenvolvimento de produto',
    en: 'LX3 collection — product development',
  },
};

const PROJECT_LABELS: Record<string, { pt: string; en: string }> = {
  oceanario: { pt: 'Oceanário de Lisboa', en: 'Oceanário de Lisboa' },
  'fundacao-oceano-azul': { pt: 'Fundação Oceano Azul', en: 'Fundação Oceano Azul' },
  sfms: { pt: 'Sociedade Francisco Manuel dos Santos', en: 'Sociedade Francisco Manuel dos Santos' },
  seathefuture: { pt: 'SEATHEFUTURE', en: 'SEATHEFUTURE' },
  lx3: { pt: 'LX3', en: 'LX3' },
};

const CATEGORY_LABELS: Record<string, { pt: string; en: string }> = {
  vestuario: { pt: 'Vestuário', en: 'Apparel' },
  swimwear: { pt: 'Swimwear', en: 'Swimwear' },
  acessorios: { pt: 'Acessórios', en: 'Accessories' },
  ceramica: { pt: 'Cerâmica', en: 'Ceramics' },
  papelaria: { pt: 'Papelaria', en: 'Stationery' },
  'textil-lar': { pt: 'Têxtil-lar', en: 'Home textiles' },
  uniformes: { pt: 'Uniformes', en: 'Uniforms' },
  merchandising: { pt: 'Merchandising', en: 'Merchandising' },
  outros: { pt: 'Sessão Fotográfica', en: 'Photo shoot' },
  'design-grafico': { pt: 'Design Gráfico', en: 'Graphic design' },
  packaging: { pt: 'Packaging', en: 'Packaging' },
};

function humanizeFilename(filename: string): string {
  return filename
    .replace(/\.[a-z]+$/i, '')
    .replace(/^gallery-\d+-/, '')
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getImageAlt(assetPath: string, locale: Locale, fallback?: string): string {
  const entry = imageAlt[assetPath];
  if (entry) return entry[locale];

  const projectMatch = assetPath.match(/^projects\/([^/]+)\//);
  if (projectMatch) {
    const label = PROJECT_LABELS[projectMatch[1]];
    if (label) return label[locale];
  }

  const categoryMatch = assetPath.match(/^categories\/([^/]+)\/(.+)$/);
  if (categoryMatch) {
    const [, categorySlug, filename] = categoryMatch;
    const category = CATEGORY_LABELS[categorySlug];
    const detail = humanizeFilename(filename);
    if (category) {
      return locale === 'pt'
        ? `${category.pt} — ${detail}`
        : `${category.en} — ${detail}`;
    }
  }

  return fallback ?? humanizeFilename(assetPath.split('/').pop() ?? 'Product');
}
