import { type ReactNode, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { ShieldAlert } from 'lucide-react';

import useAuth from '@/stores/auth.store';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';

export default function AuthenticatedOnly({
  roles,
  loadingSkeleton,
  minLoadingTime = 1000,
}: {
  roles?: string[];
  loadingSkeleton?: ReactNode;
  minLoadingTime?: number;
}) {
  const auth = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  // jika status masih loading atau belum mencapai min loading time
  if ((auth.loading && !auth.user) || !minTimePassed) {
    return loadingSkeleton;
  }

  // jika user belum login atau token error
  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  // jika user tidak memiliki role yang sesuai
  if (roles && !roles.includes(auth.user.role)) {
    return <Unauthorized />;
  }

  return <Outlet />;
}

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="bg-background flex h-screen w-full items-center justify-center p-4">
      <Empty>
        <div className="mb-4 flex justify-center">
          <div className="bg-destructive/10 rounded-full p-4">
            <ShieldAlert className="text-destructive h-12 w-12" />
          </div>
        </div>
        <EmptyHeader>
          <EmptyTitle>Akses Ditolak</EmptyTitle>
          <EmptyDescription>Anda tidak memiliki izin untuk mengakses halaman ini.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Kembali
            </Button>
            <Button onClick={() => navigate('/')}>Ke Beranda</Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
