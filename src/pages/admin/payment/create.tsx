import { useNavigate, useSearchParams } from 'react-router-dom';

import { toast } from 'sonner';

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

  const handleSubmit = async (data: any) => {
    await adminPaymentService.createPayment(data);
    toast.success('Pembayaran berhasil dicatat.');
    navigate('/admin/payment');
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
        <PaymentForm onSubmit={handleSubmit} invoiceId={invoiceId} />
      </LayoutContentBody>
    </LayoutContent>
  );
}
