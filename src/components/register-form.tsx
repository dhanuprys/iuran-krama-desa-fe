import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from 'sonner';

import { Constants } from '@/config/constants';

import useAuth from '@/stores/auth.store';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

export function RegisterForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const register = useAuth((state) => state.register);
  const loading = useAuth((state) => state.loading);
  const error = useAuth((state) => state.error);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error('Password tidak cocok');
      return;
    }

    const success = await register(formData);
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
          <h1 className="text-2xl font-bold">Buat akun baru</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masukkan detail Anda di bawah untuk membuat akun
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">{error}</div>
        )}

        <Field>
          <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            required
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password_confirmation">Konfirmasi Password</FieldLabel>
          <Input
            id="password_confirmation"
            type="password"
            required
            value={formData.password_confirmation}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Sudah punya akun?{' '}
            <Link to="/login" className="underline underline-offset-4">
              Masuk
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
