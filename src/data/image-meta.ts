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
  'projects/oceanario/gallery-01-mg-1311.jpg': {
    pt: 'Oceanário de Lisboa — merchandising têxtil',
    en: 'Oceanário de Lisboa — textile merchandising',
  },
  'projects/oceanario/gallery-02-mg-1344.jpg': {
    pt: 'Oceanário de Lisboa — produtos de papelaria',
    en: 'Oceanário de Lisboa — stationery products',
  },
  'projects/oceanario/gallery-03-img-1439.jpg': {
    pt: 'Oceanário de Lisboa — vestuário sustentável',
    en: 'Oceanário de Lisboa — sustainable apparel',
  },
  'projects/oceanario/gallery-04-chatgpt-image-apr-24-2026-at-03-43-12-pm.jpg': {
    pt: 'Oceanário de Lisboa — cerâmica e vidro',
    en: 'Oceanário de Lisboa — ceramics and glass',
  },
  'projects/fundacao-oceano-azul/gallery-01-chatgpt-image-apr-24-2026-at-01-30-23-pm.jpg': {
    pt: 'Fundação Oceano Azul — farda institucional',
    en: 'Fundação Oceano Azul — institutional uniform',
  },
  'projects/fundacao-oceano-azul/gallery-02-chatgpt-image-apr-24-2026-at-03-04-02-pm.jpg': {
    pt: 'Fundação Oceano Azul — detalhe da farda',
    en: 'Fundação Oceano Azul — uniform detail',
  },
  'projects/fundacao-oceano-azul/gallery-03-chatgpt-image-apr-24-2026-at-03-14-38-pm.jpg': {
    pt: 'Fundação Oceano Azul — farda em contexto',
    en: 'Fundação Oceano Azul — uniform in context',
  },
  'projects/fundacao-oceano-azul/gallery-04-chatgpt-image-apr-24-2026-at-03-32-41-pm.jpg': {
    pt: 'Fundação Oceano Azul — farda em evento internacional',
    en: 'Fundação Oceano Azul — uniform at international event',
  },
  'projects/fundacao-oceano-azul/gallery-05-chatgpt-image-apr-24-2026-at-03-36-41-pm.jpg': {
    pt: 'Fundação Oceano Azul — detalhe de acabamento',
    en: 'Fundação Oceano Azul — finishing detail',
  },
  'projects/sfms/gallery-01-chatgpt-image-jun-16-2026-at-03-50-52-pm.jpg': {
    pt: 'SFMS — gifting institucional',
    en: 'SFMS — institutional gifting',
  },
  'projects/sfms/gallery-02-chatgpt-image-jun-16-2026-at-03-53-54-pm.jpg': {
    pt: 'SFMS — detalhe de presente institucional',
    en: 'SFMS — institutional gift detail',
  },
  'projects/seathefuture/gallery-01-stf-421.jpg': {
    pt: 'SEATHEFUTURE — cápsula de vestuário',
    en: 'SEATHEFUTURE — apparel capsule',
  },
  'projects/seathefuture/gallery-02-stf-432.jpg': {
    pt: 'SEATHEFUTURE — shooting de marca',
    en: 'SEATHEFUTURE — brand photoshoot',
  },
  'projects/lx3/gallery-01-20260423-lx3-197.jpg': {
    pt: 'LX3 — coleção swimwear',
    en: 'LX3 — swimwear collection',
  },
  'projects/lx3/gallery-02-20260423-lx3-632.jpg': {
    pt: 'LX3 — detalhe de roupa de praia',
    en: 'LX3 — beachwear detail',
  },
  'categories/design-grafico/stf-catalog.preview.jpg': {
    pt: 'Catálogo STF',
    en: 'STF Catalog',
  },
  'categories/design-grafico/stf-impact-report.preview.jpg': {
    pt: 'Relatório de Impacto STF',
    en: 'STF Impact Report',
  },
  'categories/packaging/seathefuture-envelope-visualizacao.png': {
    pt: 'Packaging SEATHEFUTURE — envelope kraft sustentável',
    en: 'SEATHEFUTURE packaging — sustainable kraft envelope',
  },
  'categories/packaging/lx3-packaging-mockup.png': {
    pt: 'Packaging LX3 — saco, saquinho e cartão de agradecimento',
    en: 'LX3 packaging — bag, pouch and thank-you card',
  },
  'categories/packaging/seathefuture-socks-header.png': {
    pt: 'Packaging SEATHEFUTURE — header kraft para meias',
    en: 'SEATHEFUTURE packaging — kraft header for socks',
  },
  'categories/packaging/seathefuture-keychain-header.png': {
    pt: 'Packaging SEATHEFUTURE — header para porta-chaves',
    en: 'SEATHEFUTURE packaging — keychain header card',
  },
  'categories/vestuario/img-1439.jpg': {
    pt: 'T-shirts e Sweatshirts algodão reciclado',
    en: 'T-shirts and sweatshirts in recycled cotton',
  },
  'categories/ceramica-vidro/dscf8170.jpg': {
    pt: 'Canecas personalizadas',
    en: 'Custom mugs',
  },
  'categories/uniformes/oceanario-chatgpt-image-apr-24-2026-at-11-52-02-am.jpg': {
    pt: 'Fardas Institucionais sustentáveis personalizadas',
    en: 'Custom sustainable institutional uniforms',
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
  'ceramica-vidro': { pt: 'Cerâmica e Vidro', en: 'Ceramics and Glass' },
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

function isWeakAlt(text: string): boolean {
  return /chatgpt|dscf|img-\d|mg-\d|shooting-/i.test(text);
}

function projectGalleryAlt(projectSlug: string, assetPath: string, locale: Locale): string | undefined {
  const label = PROJECT_LABELS[projectSlug];
  if (!label) return undefined;

  if (assetPath.endsWith('/hero.jpg')) {
    return label[locale];
  }

  const galleryMatch = assetPath.match(/gallery-(\d+)/);
  const index = galleryMatch?.[1] ?? '1';

  return locale === 'pt'
    ? `${label.pt} — vista ${index}`
    : `${label.en} — view ${index}`;
}

export function getImageAlt(assetPath: string, locale: Locale, fallback?: string): string {
  const entry = imageAlt[assetPath];
  if (entry) return entry[locale];

  const projectMatch = assetPath.match(/^projects\/([^/]+)\//);
  if (projectMatch) {
    const projectAlt = projectGalleryAlt(projectMatch[1], assetPath, locale);
    if (projectAlt) return projectAlt;
  }

  const categoryMatch = assetPath.match(/^categories\/([^/]+)\/(.+)$/);
  if (categoryMatch) {
    const [, categorySlug, filename] = categoryMatch;
    const category = CATEGORY_LABELS[categorySlug];
    const detail = humanizeFilename(filename);
    if (category && !isWeakAlt(detail)) {
      return locale === 'pt'
        ? `${category.pt} — ${detail}`
        : `${category.en} — ${detail}`;
    }
    if (category) {
      return category[locale];
    }
  }

  const fallbackText = fallback ?? humanizeFilename(assetPath.split('/').pop() ?? 'Product');
  return isWeakAlt(fallbackText) ? (fallback ?? 'Product') : fallbackText;
}
