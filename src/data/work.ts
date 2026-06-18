import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/utils';
import { getImageAlt } from './image-meta';

export type ProjectPeriod =
  | { type: 'single'; year: string }
  | { type: 'since'; year: string }
  | { type: 'range'; from: string; to: string };

export interface Project {
  client: string;
  category: { pt: string; en: string };
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
  src: ImageMetadata;
  assetPath: string;
}

interface ProjectDef {
  client: string;
  category: { pt: string; en: string };
  period: ProjectPeriod;
  slug: string;
  featured: boolean;
  caseStudyGalleryFiles?: string[];
}

const PROJECT_DEFS: ProjectDef[] = [
  {
    client: 'Oceanário de Lisboa',
    category: { pt: 'Merchandising', en: 'Merchandising' },
    period: { type: 'since', year: '2021' },
    slug: 'oceanario',
    featured: true,
  },
  {
    client: 'Fundação Oceano Azul',
    category: { pt: 'Farda institucional', en: 'Institutional uniform' },
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
    category: { pt: 'Gifting institucional', en: 'Institutional gifting' },
    period: { type: 'since', year: '2023' },
    slug: 'sfms',
    featured: true,
  },
  {
    client: 'SEATHEFUTURE',
    category: { pt: 'Vestuário & Comunicação de Marca', en: 'Apparel & Brand Communication' },
    period: { type: 'single', year: '2023 - 2025' },
    slug: 'seathefuture',
    featured: false,
  },
  {
    client: 'LX3',
    category: { pt: 'Desenvolvimento de Produto', en: 'Product development' },
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
  { slug: 'outros', label: { pt: 'Outros', en: 'Other' } },
];

const projectModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projects/**/*.jpg',
  { eager: true },
);

const categoryModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/categories/**/*.jpg',
  { eager: true },
);

interface ProjectImages {
  hero?: ImageMetadata;
  gallery: ImageMetadata[];
  byFileName: Map<string, ImageMetadata>;
}

function assetPathFromModulePath(modulePath: string): string {
  return modulePath.replace(/^(\.\.\/assets\/)/, '').replace(/\\/g, '/');
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
    const bucket = bySlug.get(slug) ?? { gallery: [], byFileName: new Map() };

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
  const slugMatch = assetPath.match(/^categories\/([^/]+)\//);
  if (!slugMatch) continue;

  const slug = slugMatch[1];
  const items = itemsByCategory.get(slug) ?? [];
  items.push({ src: mod.default, assetPath });
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
