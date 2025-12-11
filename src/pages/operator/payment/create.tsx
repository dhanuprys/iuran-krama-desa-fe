import { useNavigate, useSearchParams } from 'react-router-dom';

import { toast } from 'sonner';

import operatorPaymentService from '@/services/operator-payment.service';

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

export default function OperatorPaymentCreatePage() {
  useBreadcrumb([
    { title: 'Kelola Pembayaran', href: '/operator/payment' },
    { title: 'Catat Pembayaran' },
  ]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoice_id') || undefined;

  const handleSubmit = async (data: any) => {
    await operatorPaymentService.createPayment(data);
    toast.success('Pembayaran berhasil dicatat.');
    navigate('/operator/payment');
  };

  return (
    <LayoutContent>
      <PageHead title="Catat Pembayaran" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/operator/payment')} />}
        header={
          <div>
            <LayoutContentHead>Catat Pembayaran</LayoutContentHead>
            <LayoutContentSubHead>Buat catatan pembayaran baru untuk krama.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <PaymentForm onSubmit={handleSubmit} invoiceId={invoiceId} baseApiUrl="/operator" />
      </LayoutContentBody>
    </LayoutContent>
  );
}
