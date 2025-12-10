import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Payment } from '@/types/entity';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminPaymentEditPage() {
  useBreadcrumb([
    { title: 'Kelola Pembayaran', href: '/admin/payment' },
    { title: 'Edit Pembayaran' },
  ]);

  const navigate = useNavigate();
  const { id } = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchPayment(parseInt(id));
  }, [id]);

  const fetchPayment = async (paymentId: number) => {
    try {
      const res = await adminPaymentService.getPayment(paymentId);
      if (res.success && res.data) {
        setPayment(res.data);
      } else {
        setError('Data pembayaran tidak ditemukan.');
      }
    } catch (e) {
      setError('Gagal memuat data pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!payment) return;

    // Remove invariant fields if necessary or api handles it.
    // Validation keeps invoice_id but it shouldn't change usually unless logic allows.

    await adminPaymentService.updatePayment(payment.id, data);
    toast.success('Pembayaran berhasil diperbarui.');
    navigate(`/admin/payment/${payment.id}`);
  };

  if (loading) {
    return (
      <LayoutContent>
        <div className="flex justify-center py-10">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </LayoutContent>
    );
  }

  if (error || !payment) {
    return (
      <LayoutContent>
        <LayoutContentHeader
          backButton={<LayoutContentBackButton onClick={() => navigate('/admin/payment')} />}
          header={<LayoutContentHead>Error</LayoutContentHead>}
        />
        <LayoutContentBody>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Data tidak ditemukan'}</AlertDescription>
          </Alert>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Edit Pembayaran" />
      <LayoutContentHeader
        backButton={
          <LayoutContentBackButton onClick={() => navigate(`/admin/payment/${payment.id}`)} />
        }
        header={
          <div>
            <LayoutContentHead>Edit Pembayaran #{payment.id}</LayoutContentHead>
            <LayoutContentSubHead>Perbarui data pembayaran.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <PaymentForm onSubmit={handleSubmit} initialData={payment} isEditing />
      </LayoutContentBody>
    </LayoutContent>
  );
}
