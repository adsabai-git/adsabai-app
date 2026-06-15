import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://adsabai.com';
  const now = new Date();

  return [
    { url: base,                    lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/auth/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/auth/login`,    lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/ads/basic`,     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/ads/standard`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/ads/premium`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,         lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,       lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/privacy`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
