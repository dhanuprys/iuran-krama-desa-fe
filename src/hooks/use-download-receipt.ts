import { useState } from 'react';

import { downloadPdf } from '@/lib/utils';

export function useDownloadReceipt(downloadService: (id: number) => Promise<Blob>) {
  const [loading, setLoading] = useState(false);

  const download = async (id: number, filename?: string) => {
    setLoading(true);
    try {
      const blob = await downloadService(id);
      downloadPdf(blob, filename || `receipt-${id}.pdf`);
    } catch (error) {
      console.error('Failed to download receipt', error);
    } finally {
      setLoading(false);
    }
  };

  return { download, loading };
}
