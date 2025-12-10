import { useEffect } from 'react';

interface PageHeadProps {
  title?: string;
}

export const PageHead = ({ title }: PageHeadProps) => {
  const siteTitle = 'Iuran Krama Desa';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  return null;
};
