type StepType = 'account' | 'post' | 'customers';
type PackageType = 'basic' | 'standard' | 'premium';

export function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="modern-icon" aria-hidden="true">
      {children}
    </div>
  );
}

export function StepIcon({ type }: { type: StepType }) {
  switch (type) {
    case 'account':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="accountGradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#F0D078" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="24" r="13" fill="url(#accountGradient)" opacity="0.95" />
          <path d="M16 54C16 42.9543 24.9543 34 36 34H28C39.0457 34 48 42.9543 48 54" stroke="#0D1B2A" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'post':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="postGradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#F0D078" />
            </linearGradient>
          </defs>
          <rect x="14" y="14" width="36" height="36" rx="10" fill="url(#postGradient)" opacity="0.95" />
          <path d="M22 24H42" stroke="#0D1B2A" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 32H42" stroke="#0D1B2A" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 40H34" stroke="#0D1B2A" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'customers':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="customerGradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#F0D078" />
            </linearGradient>
          </defs>
          <circle cx="21" cy="24" r="10" fill="url(#customerGradient)" opacity="0.95" />
          <circle cx="43" cy="24" r="8" fill="url(#customerGradient)" opacity="0.95" />
          <path d="M10 54C10 44.6112 17.6112 37 27 37H37C46.3888 37 54 44.6112 54 54" stroke="#0D1B2A" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function PackageIcon({ type }: { type: PackageType }) {
  const common = (
    <path d="M32 14L20 26V44L44 50V26L32 14Z" stroke="#0D1B2A" strokeWidth="4" strokeLinejoin="round" />
  );

  const premiumOverlay = (
    <path d="M23 40L28 33L34 40L42 24" stroke="#0D1B2A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  );

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="packageGradient" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F0D078" />
        </linearGradient>
      </defs>
      <rect x="14" y="18" width="36" height="28" rx="10" fill="url(#packageGradient)" opacity="0.95" />
      {common}
      {type === 'premium' && premiumOverlay}
      {type === 'standard' && <path d="M22 34H42" stroke="#0D1B2A" strokeWidth="4" strokeLinecap="round" />}
      {type === 'basic' && <circle cx="32" cy="34" r="4" fill="#0D1B2A" />}
    </svg>
  );
}
