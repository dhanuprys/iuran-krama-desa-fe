import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export interface Breadcrumb {
  title: string;
  href?: string;
}

export interface BreadcrumbContextType {
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

export function useBreadcrumb(breadcrumbs: Breadcrumb[]) {
  const context = useOutletContext<BreadcrumbContextType>();

  // Guard against missing context
  if (!context || typeof context.setBreadcrumbs !== 'function') {
    console.warn(
      'useBreadcrumb must be used within a layout that provides setBreadcrumbs via Outlet context.',
    );
    return;
  }

  const { setBreadcrumbs } = context;

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, [JSON.stringify(breadcrumbs), setBreadcrumbs]); // Use JSON.stringify to avoid infinite loop if array ref changes
}
