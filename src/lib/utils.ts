import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFamilyStatus(status: string): string {
  const map: Record<string, string> = {
    HEAD_OF_FAMILY: 'Kepala Keluarga',
    HUSBAND: 'Suami',
    WIFE: 'Istri',
    CHILD: 'Anak',
    PARENT: 'Orang Tua',
  };
  return map[status] || status.replace(/_/g, ' ');
}

export function formatRole(role: string): string {
  const map: Record<string, string> = {
    admin: 'Admin',
    krama: 'Krama',
    resident: 'Penduduk',
    RESIDENT: 'Penduduk',
    ADMIN: 'Admin',
    KRAMA: 'Krama',
  };
  return map[role] || role;
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
