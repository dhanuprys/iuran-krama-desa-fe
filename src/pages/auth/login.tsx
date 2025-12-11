import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Constants } from '@/config/constants';

import useAuth from '@/stores/auth.store';

import { LoginForm } from '@/components/login-form';
import { PageHead } from '@/components/page-head';

import logo from '@/assets/desa-sangket.png';
import loginImage from '@/assets/login.jpg';

export default function LoginPage() {
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === Constants.ROLES.ADMIN) {
        navigate('/admin/dashboard');
      } else if (user.role === Constants.ROLES.OPERATOR) {
        navigate('/operator/dashboard');
      } else {
        navigate('/krama/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <PageHead title="Masuk" />
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center overflow-hidden">
              <img src={logo} alt="Desa Sangket" className="size-full object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold">Iuran Krama</span>
              <span className="text-muted-foreground">Desa Sangket</span>
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
