import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { toast } from 'sonner';

import type { FormValidationErrors } from '@/types/form';

import adminPaymentService from '@/services/admin-payment.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
  LayoutContentBackButton,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { PaymentForm } from '@/components/payment-form';

export default function AdminPaymentCreatePage() {
  useBreadcrumb([
    { title: 'Kelola Pembayaran', href: '/admin/payment' },
    { title: 'Catat Pembayaran' },
  ]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoice_id') || undefined;
  const [errors, setErrors] = useState<FormValidationErrors | null>(null);

  const handleSubmit = async (data: any) => {
    setErrors(null);
    try {
      const response = await adminPaymentService.createPayment(data);
      if (response.success) {
        toast.success('Pembayaran berhasil dicatat.');
        navigate('/admin/payment');
      } else {
        toast.error(response.error?.message || 'Gagal mencatat pembayaran.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error?.details) {
        setErrors(err.response.data.error.details);
        toast.error('Gagal mencatat pembayaran. Mohon periksa input form.');
      } else {
        const message =
          err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data.';
        toast.error(message);
      }
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Catat Pembayaran" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/payment')} />}
        header={
          <div>
            <LayoutContentHead>Catat Pembayaran</LayoutContentHead>
            <LayoutContentSubHead>Buat catatan pembayaran baru untuk krama.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <PaymentForm
          onSubmit={handleSubmit}
          invoiceId={invoiceId}
          baseApiUrl="/admin"
          serverErrors={errors}
        />
      </LayoutContentBody>
    </LayoutContent>
  );
}
