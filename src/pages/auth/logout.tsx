import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import authService from '@/services/auth.service';

export default function LogoutPage() {
  useEffect(() => {
    authService.logout();
  }, []);

  return <Navigate to="/login" />;
}
