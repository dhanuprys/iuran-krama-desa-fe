import { useNavigate } from 'react-router-dom';

import { PageHead } from '@/components/page-head';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4">
      <PageHead title="Halaman Tidak Ditemukan" />
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need
            below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
            Go Back
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
