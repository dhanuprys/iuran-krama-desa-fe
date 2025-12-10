import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Constants } from '@/config/constants';

import useAuth from '@/stores/auth.store';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuth((state) => state.login);
  const loading = useAuth((state) => state.loading);
  const error = useAuth((state) => state.error);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      const user = useAuth.getState().user;
      if (user?.role === Constants.ROLES.ADMIN) {
        navigate('/admin/dashboard');
      } else {
        navigate('/payment/announcement'); // Default krama page
      }
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Masuk ke akun Anda</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masukkan email Anda di bawah untuk masuk ke akun Anda
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">{error}</div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? 'Sedang masuk...' : 'Masuk'}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Belum punya akun?{' '}
            <Link to="/register" className="underline underline-offset-4">
              Daftar
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
