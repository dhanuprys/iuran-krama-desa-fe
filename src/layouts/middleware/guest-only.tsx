import { Navigate, Outlet } from 'react-router-dom';

import { Constants } from '@/config/constants';

import useAuth from '@/stores/auth.store';

export default function GuestOnly() {
  const auth = useAuth();

  // jika status masih loading
  if (auth.loading && !auth.user) {
    return <div>Loading...</div>;
  }

  // jika user sudah login atau token error
  if (auth.user) {
    return <Navigate to={auth.user.role === Constants.ROLES.ADMIN ? '/admin' : '/'} />;
  }

  return <Outlet />;
}
