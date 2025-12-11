import { useState } from 'react';

import { downloadPdf } from '@/lib/utils';

export function useDownloadInvoice(
    downloadServiceFn: (id: number) => Promise<Blob>,
) {
    const [loading, setLoading] = useState(false);

    const download = async (id: number, filename?: string) => {
        try {
            setLoading(true);
            const blob = await downloadServiceFn(id);
            downloadPdf(blob, filename || `invoice-${id}.pdf`);
        } catch (error) {
            console.error('Failed to download invoice', error);
            // You could add a toast notification here if you have a toast hook
        } finally {
            setLoading(false);
        }
    };

    return { download, loading };
}
