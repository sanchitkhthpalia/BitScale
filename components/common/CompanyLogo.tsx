import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';

type Tier = 1 | 2 | 3;

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  website?: string;
  size?: number;
}

const resolveDomain = (url: string) => {
  try {
    return url.replace(/https?:\/\//, '').split('/')[0];
  } catch {
    return null;
  }
};

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  name,
  logoUrl,
  website,
  size = 24,
}) => {
  const [tier, setTier] = useState<Tier>(1);
  const [imgSrc, setImgSrc] = useState<string | undefined>(logoUrl);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (logoUrl) {
      setImgSrc(logoUrl);
      setTier(1);
    } else if (website) {
      const domain = resolveDomain(website);
      if (domain) {
        setImgSrc(`https://logo.clearbit.com/${domain}`);
        setTier(1);
      }
    } else {
      setImgSrc(undefined);
    }
    setIsLoading(true);
  }, [logoUrl, website]);

  const handleError = () => {
    const domain = website ? resolveDomain(website) : null;
    if (tier === 1 && domain) {
      setTier(2);
      setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
      return;
    }
    setTier(3);
    setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Company')}&background=random&color=fff&size=128`);
  };

  return (
    <div
      className="rounded-md shadow-sm border border-gray-100 flex items-center justify-center bg-white overflow-hidden p-0.5 shrink-0 relative"
      style={{ width: size, height: size }}
    >
      {isLoading && <div className="absolute inset-0 bg-gray-50 animate-pulse" />}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={name || 'Company logo'}
          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <Building2 size={size / 2} className="text-gray-300" />
      )}
    </div>
  );
};

export default CompanyLogo;
