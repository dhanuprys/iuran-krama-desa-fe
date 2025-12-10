import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';

import type { Announcement } from '@/types/entity';
import type { PaginatedResponse } from '@/types/http';

import kramaAnnouncementService from '@/services/krama-announcement.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import { AppPagination } from '@/components/app-pagination';
import {
  LayoutContent,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function KramaPaymentAnnouncementPage() {
  useBreadcrumb([{ title: 'Iuran' }, { title: 'Pengumuman' }]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PaginatedResponse<Announcement>['meta'] | null>(null);

  useEffect(() => {
    fetchAnnouncements(1);
  }, []);

  const fetchAnnouncements = async (p: number) => {
    setLoading(true);
    try {
      const data = await kramaAnnouncementService.getAnnouncements(p);
      setAnnouncements(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError('Gagal memuat pengumuman. Silakan coba lagi nanti.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Pengumuman" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Pengumuman</LayoutContentHead>
            <LayoutContentSubHead>Daftar pengumuman iuran</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : announcements.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              Tidak ada pengumuman saat ini.
            </div>
          ) : (
            <>
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{announcement.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(announcement.created_at), 'dd MMMM yyyy HH:mm', {
                            locale: id,
                          })}
                          {announcement.creator && ` • Oleh ${announcement.creator.name}`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap">{announcement.content}</div>
                  </CardContent>
                </Card>
              ))}

              {meta && (
                <AppPagination meta={meta} onPageChange={fetchAnnouncements} className="mt-4" />
              )}
            </>
          )}
        </div>
      </LayoutContentBody>
    </LayoutContent>
  );
}
