export const AD_PACKAGES = {
  basic: {
    label: 'Basic',
    price: 79,
    durationDays: 14,
    maxPhotos: 1,
    featured: false,
    accentColor: 'var(--gold)',
  },
  standard: {
    label: 'Standard',
    price: 149,
    durationDays: 21,
    maxPhotos: 3,
    featured: false,
    accentColor: 'var(--accent-green)',
  },
  premium: {
    label: 'Premium',
    price: 200,
    durationDays: 30,
    maxPhotos: 5,
    featured: true,
    accentColor: '#4DD9D9',
  },
} as const;

export type PackageType = keyof typeof AD_PACKAGES;

export function getPackage(packageType: string) {
  return AD_PACKAGES[packageType as PackageType] ?? AD_PACKAGES.basic;
}

export function getExpiresAt(createdAt: Date | string, packageType: string): Date {
  const pkg = getPackage(packageType);
  return new Date(new Date(createdAt).getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);
}

export function isExpired(createdAt: Date | string, packageType: string): boolean {
  return Date.now() > getExpiresAt(createdAt, packageType).getTime();
}

export function daysRemaining(createdAt: Date | string, packageType: string): number {
  const ms = getExpiresAt(createdAt, packageType).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
