import { ArrowLeftIcon } from 'lucide-react';

import { Button } from './ui/button';

export function LayoutContent({ children }: { children?: React.ReactNode }) {
  return <div className="p-4 md:p-8">{children}</div>;
}

export function LayoutContentHeader({
  backButton,
  header,
  info,
}: {
  backButton?: React.ReactNode;
  header: React.ReactNode;
  info?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:pt-4">
      <div className="flex items-center gap-2">
        {backButton}
        {header}
      </div>
      {info && <div className="flex items-center gap-2">{info}</div>}
    </div>
  );
}

export function LayoutContentHead({ children }: { children?: React.ReactNode }) {
  return <h1 className="text-2xl font-bold md:text-3xl">{children}</h1>;
}

export function LayoutContentSubHead({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <p className={`mt-2 text-gray-500 dark:text-gray-400 ${className || ''}`}>{children}</p>;
}

export function LayoutContentBackButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <ArrowLeftIcon className="size-8" />
    </Button>
  );
}

export function LayoutContentBody({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={`pt-4 ${className || ''}`}>{children}</div>;
}
