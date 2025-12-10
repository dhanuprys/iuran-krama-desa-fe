import { LoginForm } from '@/components/login-form';
import { PageHead } from '@/components/page-head';

export default function HomePage() {
  return (
    <>
      <PageHead title="Beranda" />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
