import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account', '/ads/manage', '/ads/edit/'],
    },
    sitemap: 'https://adsabai.com/sitemap.xml',
  };
}
