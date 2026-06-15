import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/utils';

import oceanarioImage from '../assets/images/work/oceanario/produto-7749.jpg';
import oceanarioMerch1 from '../assets/MERCHANDISING/DSCF8212.jpg';
import oceanarioMerch2 from '../assets/MERCHANDISING/DSCF8165.jpg';
import oceanarioMerch3 from '../assets/MERCHANDISING/_MG_1379.jpg';

import foaUniform1 from '../assets/UNIFORMES/Fundação Oceano Azul/BEST/32228e15-d242-4c92-84e8-6dc35bf0d3a8.JPG';
import foaUniform2 from '../assets/UNIFORMES/Fundação Oceano Azul/BEST/efabaf8d-cbd5-49aa-8b9b-e9922aa3c764.JPG';
import foaUniform3 from '../assets/UNIFORMES/Fundação Oceano Azul/BEST/OUTRAS FOTOS/3ef09c7e-5939-482a-998b-987bfa5cb9e2.JPG';
import foaUniform4 from '../assets/UNIFORMES/Fundação Oceano Azul/BEST/OUTRAS FOTOS/b92db0d9-6e03-4f15-ade8-2c9048ab8a4b.JPG';

import sfmsApparel1 from '../assets/VESTUÁRIO/_MG_1311.jpg';
import sfmsApparel2 from '../assets/VESTUÁRIO/IMG_1439.jpg';
import sfmsApparel3 from '../assets/VESTUÁRIO/IMG_1426.jpg';
import sfmsApparel4 from '../assets/VESTUÁRIO/20210520_OCEANARIO4603.jpg';

export interface Project {
  client: string;
  category: { pt: string; en: string };
  year: string;
  slug: string;
  featured: boolean;
  image?: ImageMetadata;
  gallery?: ImageMetadata[];
}

export interface Category {
  slug: string;
  label: { pt: string; en: string };
  assetFolder: string;
}

export interface CategoryItem {
  src: ImageMetadata;
  alt: string;
}

export const projects: Project[] = [
  {
    client: 'Oceanário de Lisboa',
    category: { pt: 'Merchandising institucional', en: 'Institutional merchandising' },
    year: '2024',
    slug: 'oceanario',
    featured: true,
    image: oceanarioImage,
    gallery: [oceanarioImage, oceanarioMerch1, oceanarioMerch2, oceanarioMerch3],
  },
  {
    client: 'Fundação Oceano Azul',
    category: { pt: 'Desenvolvimento de produto', en: 'Product development' },
    year: '2024',
    slug: 'fundacao-oceano-azul',
    featured: true,
    gallery: [foaUniform1, foaUniform2, foaUniform3, foaUniform4],
  },
  {
    client: 'SFMS',
    category: { pt: 'Vestuário e acessórios', en: 'Apparel and accessories' },
    year: '2023',
    slug: 'sfms',
    featured: true,
    gallery: [sfmsApparel1, sfmsApparel2, sfmsApparel3, sfmsApparel4],
  },
];

export const categories: Category[] = [
  { slug: 'vestuario', label: { pt: 'Vestuário', en: 'Apparel' }, assetFolder: 'VESTUÁRIO' },
  { slug: 'acessorios', label: { pt: 'Acessórios', en: 'Accessories' }, assetFolder: 'ACESSÓRIOS & BIJUTERIA' },
  { slug: 'ceramica', label: { pt: 'Cerâmica', en: 'Ceramics' }, assetFolder: 'CERÂMICA & VIDRO' },
  { slug: 'papelaria', label: { pt: 'Papelaria', en: 'Stationery' }, assetFolder: 'PAPELARIA' },
  { slug: 'textil-lar', label: { pt: 'Têxtil-lar', en: 'Home textiles' }, assetFolder: 'TEXTIL-LAR' },
  { slug: 'uniformes', label: { pt: 'Uniformes', en: 'Uniforms' }, assetFolder: 'UNIFORMES' },
  { slug: 'merchandising', label: { pt: 'Merchandising', en: 'Merchandising' }, assetFolder: 'MERCHANDISING' },
  { slug: 'outros', label: { pt: 'Outros', en: 'Other' }, assetFolder: 'BRAND COLLATERAL' },
];

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/**/*.{jpg,jpeg,png,JPG,JPEG}',
  { eager: true },
);

const IMAGE_EXT = /\.(jpe?g|png)$/i;

function getTopFolder(path: string): string | null {
  const match = path.match(/\/assets\/([^/]+)\//);
  return match ? match[1] : null;
}

function filenameFromPath(path: string): string {
  return path.split('/').pop()?.replace(IMAGE_EXT, '') ?? 'Product';
}

const itemsByFolder = new Map<string, CategoryItem[]>();

for (const [path, mod] of Object.entries(imageModules)) {
  if (path.includes('/images/')) continue;

  const folder = getTopFolder(path);
  if (!folder) continue;

  const items = itemsByFolder.get(folder) ?? [];
  items.push({
    src: mod.default,
    alt: filenameFromPath(path),
  });
  itemsByFolder.set(folder, items);
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

export function getAllProjects(): Project[] {
  return projects;
}

export function getCategoryLabel(slug: string, locale: Locale): string {
  const category = categoryBySlug.get(slug);
  return category ? category.label[locale] : slug;
}

export function getCategoryItems(slug: string): CategoryItem[] {
  const category = categoryBySlug.get(slug);
  if (!category) return [];
  return itemsByFolder.get(category.assetFolder) ?? [];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryBySlug.get(slug);
}

export function getProjectPath(slug: string, locale: Locale): string {
  return locale === 'pt' ? `/trabalho/${slug}` : `/en/work/${slug}`;
}
