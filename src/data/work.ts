import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/utils';
import { getImageAlt } from './image-meta';

export type ProjectPeriod =
  | { type: 'single'; year: string }
  | { type: 'since'; year: string }
  | { type: 'range'; from: string; to: string };

export interface Project {
  client: string;
  tags: { pt: string; en: string }[];
  period: ProjectPeriod;
  slug: string;
  featured: boolean;
  image?: ImageMetadata;
  gallery?: ImageMetadata[];
  caseStudyGallery?: ImageMetadata[];
}

export interface Category {
  slug: string;
  label: { pt: string; en: string };
}

export interface CategoryItem {
  kind: 'image' | 'document';
  src: ImageMetadata;
  assetPath: string;
  pdfUrl?: string;
  pdfAssetPath?: string;
}

interface ProjectDef {
  client: string;
  tags: { pt: string; en: string }[];
  period: ProjectPeriod;
  slug: string;
  featured: boolean;
  caseStudyGalleryFiles?: string[];
}

const PROJECT_DEFS: ProjectDef[] = [
  {
    client: 'Oceanário de Lisboa',
    tags: [
      { pt: 'Merchandising', en: 'Merchandising' },
      { pt: 'Desenvolvimento de produto', en: 'Product development' },
      { pt: 'Design', en: 'Design' },
      { pt: 'Produção', en: 'Production' },
      { pt: 'Sustentável', en: 'Sustainable' },
      { pt: 'Vestuário', en: 'Apparel' },
      { pt: 'Cerâmica', en: 'Ceramics' },
      { pt: 'Papelaria', en: 'Stationery' },
    ],
    period: { type: 'since', year: '2021' },
    slug: 'oceanario',
    featured: true,
  },
  {
    client: 'Fundação Oceano Azul',
    tags: [
      { pt: 'Farda institucional', en: 'Institutional uniform' },
      { pt: 'Vestuário', en: 'Apparel' },
      { pt: 'Desenvolvimento de Produto', en: 'Product development' },
      { pt: 'Acessórios', en: 'Accessories' },
      { pt: 'Sourcing', en: 'Sourcing' },
    ],
    period: { type: 'single', year: '2024' },
    slug: 'fundacao-oceano-azul',
    featured: true,
    caseStudyGalleryFiles: [
      'gallery-01-chatgpt-image-apr-24-2026-at-01-30-23-pm.jpg',
      'gallery-03-chatgpt-image-apr-24-2026-at-03-14-38-pm.jpg',
      'gallery-04-chatgpt-image-apr-24-2026-at-03-32-41-pm.jpg',
    ],
  },
  {
    client: 'Sociedade Francisco Manuel dos Santos',
    tags: [
      { pt: 'Gifting institucional', en: 'Institutional gifting' },
      { pt: 'Consultoria', en: 'Consulting' },
      { pt: 'Coordenação', en: 'Coordination' },
      { pt: 'Luxo', en: 'Luxury' },
      { pt: 'Acessórios', en: 'Accessories' },
    ],
    period: { type: 'since', year: '2023' },
    slug: 'sfms',
    featured: true,
  },
  {
    client: 'SEATHEFUTURE',
    tags: [
      { pt: 'Vestuário', en: 'Apparel' },
      { pt: 'Comunicação de Marca', en: 'Brand communication' },
      { pt: 'Produção', en: 'Production' },
      { pt: 'Desenvolvimento de Produto', en: 'Product development' },
      { pt: 'Shooting', en: 'Photo shoot' },
      { pt: 'Packaging', en: 'Packaging' },
    ],
    period: { type: 'single', year: '2023 - 2025' },
    slug: 'seathefuture',
    featured: false,
  },
  {
    client: 'LX3',
    tags: [
      { pt: 'Desenvolvimento de Produto', en: 'Product development' },
      { pt: 'Sourcing', en: 'Sourcing' },
      { pt: 'Produção', en: 'Production' },
      { pt: 'Swimwear', en: 'Swimwear' },
      { pt: 'Shooting', en: 'Photo shoot' },
      { pt: 'Packaging', en: 'Packaging' },
    ],
    period: { type: 'single', year: '2024' },
    slug: 'lx3',
    featured: false,
  },
];

export const categories: Category[] = [
  { slug: 'vestuario', label: { pt: 'Vestuário', en: 'Apparel' } },
  { slug: 'swimwear', label: { pt: 'Swimwear', en: 'Swimwear' } },
  { slug: 'acessorios', label: { pt: 'Acessórios', en: 'Accessories' } },
  { slug: 'ceramica', label: { pt: 'Cerâmica', en: 'Ceramics' } },
  { slug: 'papelaria', label: { pt: 'Papelaria', en: 'Stationery' } },
  { slug: 'textil-lar', label: { pt: 'Têxtil-lar', en: 'Home textiles' } },
  { slug: 'uniformes', label: { pt: 'Uniformes', en: 'Uniforms' } },
  { slug: 'merchandising', label: { pt: 'Merchandising', en: 'Merchandising' } },
  { slug: 'outros', label: { pt: 'Sessão Fotográfica', en: 'Photo shoot' } },
  { slug: 'design-grafico', label: { pt: 'Design Gráfico', en: 'Graphic design' } },
  { slug: 'packaging', label: { pt: 'Packaging', en: 'Packaging' } },
];

const projectModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projects/**/*.jpg',
  { eager: true },
);

const categoryModules = import.meta.glob<{ default: ImageMetadata }>(
  ['../assets/categories/**/*.jpg', '../assets/categories/**/*.png'],
  { eager: true },
);

const categoryPreviewModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/categories/**/*.preview.jpg',
  { eager: true },
);

const categoryPdfModules = import.meta.glob<string>(
  '../assets/categories/**/*.pdf',
  { eager: true, query: '?url', import: 'default' },
);

interface ProjectImages {
  hero?: ImageMetadata;
  gallery: ImageMetadata[];
  byFileName: Map<string, ImageMetadata>;
}

function assetPathFromModulePath(modulePath: string): string {
  return modulePath.replace(/^(\.\.\/assets\/)/, '').replace(/\\/g, '/');
}

function emptyProjectImages(): ProjectImages {
  return { gallery: [], byFileName: new Map() };
}

function buildProjectImages(): Map<string, ProjectImages> {
  const bySlug = new Map<string, ProjectImages>();

  const entries = Object.entries(projectModules).map(([modulePath, mod]) => ({
    modulePath,
    assetPath: assetPathFromModulePath(modulePath),
    src: mod.default,
    fileName: modulePath.split('/').pop() ?? '',
  }));

  entries.sort((a, b) => a.fileName.localeCompare(b.fileName));

  for (const entry of entries) {
    const slugMatch = entry.assetPath.match(/^projects\/([^/]+)\//);
    if (!slugMatch) continue;

    const slug = slugMatch[1];
    const bucket = bySlug.get(slug) ?? emptyProjectImages();

    bucket.byFileName.set(entry.fileName, entry.src);

    if (entry.fileName === 'hero.jpg') {
      bucket.hero = entry.src;
    } else {
      bucket.gallery.push(entry.src);
    }

    bySlug.set(slug, bucket);
  }

  return bySlug;
}

function buildProjects(): Project[] {
  const imagesBySlug = buildProjectImages();

  return PROJECT_DEFS.map((def) => {
    const images = imagesBySlug.get(def.slug);
    if (!images?.hero) {
      return { ...def };
    }

    const gallery = [images.hero, ...images.gallery];
    const caseStudyGallery = def.caseStudyGalleryFiles
      ?.map((fileName) => images.byFileName.get(fileName))
      .filter((src): src is ImageMetadata => Boolean(src));

    return {
      ...def,
      image: images.hero,
      gallery,
      ...(caseStudyGallery?.length ? { caseStudyGallery } : {}),
    };
  });
}

export const projects: Project[] = buildProjects();

const itemsByCategory = new Map<string, CategoryItem[]>();

for (const [modulePath, mod] of Object.entries(categoryModules)) {
  const assetPath = assetPathFromModulePath(modulePath);
  if (assetPath.endsWith('.preview.jpg')) continue;

  const slugMatch = assetPath.match(/^categories\/([^/]+)\//);
  if (!slugMatch) continue;

  const slug = slugMatch[1];
  const items = itemsByCategory.get(slug) ?? [];
  items.push({ kind: 'image', src: mod.default, assetPath });
  itemsByCategory.set(slug, items);
}

const previewsByPdfBasename = new Map<string, { src: ImageMetadata; assetPath: string }>();

for (const [modulePath, mod] of Object.entries(categoryPreviewModules)) {
  const assetPath = assetPathFromModulePath(modulePath);
  const match = assetPath.match(/^categories\/([^/]+)\/(.+)\.preview\.jpg$/);
  if (!match) continue;

  const [, slug, basename] = match;
  previewsByPdfBasename.set(`${slug}/${basename}`, {
    src: mod.default,
    assetPath,
  });
}

for (const [modulePath, pdfUrl] of Object.entries(categoryPdfModules)) {
  const pdfAssetPath = assetPathFromModulePath(modulePath);
  const match = pdfAssetPath.match(/^categories\/([^/]+)\/(.+)\.pdf$/i);
  if (!match) continue;

  const [, slug, basename] = match;
  const preview = previewsByPdfBasename.get(`${slug}/${basename}`);
  if (!preview) continue;

  const items = itemsByCategory.get(slug) ?? [];
  items.push({
    kind: 'document',
    src: preview.src,
    assetPath: preview.assetPath,
    pdfUrl,
    pdfAssetPath,
  });
  itemsByCategory.set(slug, items);
}

for (const items of itemsByCategory.values()) {
  items.sort((a, b) => a.assetPath.localeCompare(b.assetPath));
}

const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectGallery(project: Project): ImageMetadata[] {
  if (project.gallery?.length) return project.gallery;
  if (project.image) return [project.image];
  return [];
}

export function getCaseStudyGallery(project: Project): ImageMetadata[] {
  if (project.caseStudyGallery?.length) return project.caseStudyGallery;
  return getProjectGallery(project);
}

export function getCaseStudies(): Project[] {
  return projects;
}

const caseStudySlugToCopyKey: Record<string, string> = {
  oceanario: 'oceanario',
  'fundacao-oceano-azul': 'foa',
  sfms: 'sfms',
  seathefuture: 'seathefuture',
  lx3: 'lx3',
};

export function getCaseStudyCopyKey(slug: string): string | undefined {
  return caseStudySlugToCopyKey[slug];
}

export function formatProjectPeriod(period: ProjectPeriod, locale: Locale): string {
  switch (period.type) {
    case 'single':
      return period.year;
    case 'since':
      return locale === 'pt' ? `desde ${period.year}` : `since ${period.year}`;
    case 'range':
      return `${period.from} – ${period.to}`;
  }
}

export function getCategoryLabel(slug: string, locale: Locale): string {
  const category = categoryBySlug.get(slug);
  return category ? category.label[locale] : slug;
}

export function getCategoryItems(slug: string): CategoryItem[] {
  return itemsByCategory.get(slug) ?? [];
}

export function getCategoryItemAlt(item: CategoryItem, locale: Locale): string {
  return getImageAlt(item.assetPath, locale);
}

export function getCategoryDocumentDownloadName(item: CategoryItem): string {
  if (!item.pdfAssetPath) return 'document.pdf';
  return item.pdfAssetPath.split('/').pop() ?? 'document.pdf';
}

export function getProjectPath(slug: string, locale: Locale): string {
  return locale === 'pt' ? `/trabalho#${slug}` : `/en/work#${slug}`;
}

export function getCategoryPath(slug: string, locale: Locale): string {
  return locale === 'pt' ? `/o-que-fazemos#${slug}` : `/en/what-we-do#${slug}`;
}

export function getCategoryPreviewImages(slug: string, limit = 5): ImageMetadata[] {
  return getCategoryItems(slug)
    .slice(0, limit)
    .map((item) => item.src);
}

export function getDefaultOgImage(): ImageMetadata | undefined {
  return getFeaturedProjects().find((p) => p.image)?.image;
}
