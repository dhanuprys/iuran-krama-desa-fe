import { apiClient } from '@/lib/api';

export class KramaPaymentService {
    async downloadReceipt(id: number) {
        const response = await apiClient.get<Blob>(`/krama/payments/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    }
}

export default new KramaPaymentService();
