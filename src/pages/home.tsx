import useAuth from '@/stores/auth.store';
import { Navigate } from 'react-router-dom';

export default function HomePage({ loadingSkeleton }: { loadingSkeleton: React.ReactNode }) {
  const auth = useAuth();

  // jika status masih loading atau belum mencapai min loading time
  if (auth.loading && !auth.user) {
    return loadingSkeleton;
  }

  // jika user belum login atau token error
  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  if (auth.user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (auth.user.role === 'krama') {
    return <Navigate to="/dashboard" />;
  }
}
