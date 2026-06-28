import type { MetadataRoute } from 'next';

const routes = [
  '',
  '/labs',
  '/labs/iac-attack-paths',
  '/labs/pipeline',
  '/labs/access-control',
  '/writing',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `https://www.jasonachkardiab.com${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'monthly' : 'yearly',
    priority: route === '' ? 1 : 0.7,
  }));
}
