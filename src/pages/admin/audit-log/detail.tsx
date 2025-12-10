import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { AuditLog } from '@/types/entity';

import adminAuditLogService from '@/services/admin-audit-log.service';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

import { formatRole } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function AdminAuditLogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useBreadcrumb([
    { title: 'Sistem' },
    { title: 'Audit & Log Aktivitas', href: '/admin/audit-log' },
    { title: 'Detail Log' },
  ]);

  const [log, setLog] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchLog(parseInt(id));
  }, [id]);

  const fetchLog = async (logId: number) => {
    setLoading(true);
    try {
      const response = await adminAuditLogService.getLog(logId);
      if (response && response.success && response.data) {
        setLog(response.data);
      } else {
        setError('Data log tidak ditemukan.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat detail log.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LayoutContent>
        <LayoutContentHeader
          backButton={<LayoutContentBackButton onClick={() => navigate('/admin/audit-log')} />}
          header={
            <div>
              <LayoutContentHead>Detail Log</LayoutContentHead>
              <LayoutContentSubHead>Memuat data...</LayoutContentSubHead>
            </div>
          }
        />
        <LayoutContentBody>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  if (error || !log) {
    return (
      <LayoutContent>
        <LayoutContentHeader
          backButton={<LayoutContentBackButton onClick={() => navigate('/admin/audit-log')} />}
          header={
            <div>
              <LayoutContentHead>Detail Log</LayoutContentHead>
              <LayoutContentSubHead>Error</LayoutContentSubHead>
            </div>
          }
        />
        <LayoutContentBody>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Log tidak ditemukan'}</AlertDescription>
          </Alert>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Detail Log" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/audit-log')} />}
        header={
          <div>
            <LayoutContentHead>Detail Log #{log.id}</LayoutContentHead>
            <LayoutContentSubHead>
              Aksi oleh {log.user?.name || log.user?.username || 'System'} pada{' '}
              {new Date(log.created_at).toLocaleString('id-ID')}
            </LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Umum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-sm">Aksi</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'uppercase',
                    log.action === 'create'
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : log.action === 'delete'
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : log.action === 'update'
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-500 bg-gray-50 text-gray-600',
                  )}
                >
                  {log.action}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-sm">Target (Model)</span>
                <span className="font-mono text-sm">
                  {log.model_type} (#{log.model_id})
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-sm">Dilakukan Oleh</span>
                <div className="flex flex-col">
                  <span className="font-medium">{log.user?.name || 'System'}</span>
                  {log.user && (
                    <span className="text-muted-foreground text-xs">
                      {log.user.email} ({formatRole(log.user.role)})
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-sm">Waktu</span>
                <span>
                  {new Date(log.created_at).toLocaleString('id-ID', {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                  })}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-sm">IP Address</span>
                <span className="font-mono">{log.ip_address}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-sm">User Agent</span>
                <span className="text-muted-foreground text-xs break-all">{log.user_agent}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="h-full border-red-200 dark:border-red-900/50">
            <CardHeader className="bg-red-50/50 pb-2 dark:bg-red-900/10">
              <CardTitle className="text-base text-red-700 dark:text-red-400">
                Data Lama (Old Values)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ScrollArea className="bg-muted/30 h-[400px] w-full rounded-md border p-4">
                {log.old_values ? (
                  <pre className="breakdown-all font-mono text-xs whitespace-pre-wrap">
                    {JSON.stringify(log.old_values, null, 2)}
                  </pre>
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm italic">
                    Tidak ada data lama
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="h-full border-green-200 dark:border-green-900/50">
            <CardHeader className="bg-green-50/50 pb-2 dark:bg-green-900/10">
              <CardTitle className="text-base text-green-700 dark:text-green-400">
                Data Baru (New Values)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ScrollArea className="bg-muted/30 h-[400px] w-full rounded-md border p-4">
                {log.new_values ? (
                  <pre className="breakdown-all font-mono text-xs whitespace-pre-wrap">
                    {JSON.stringify(log.new_values, null, 2)}
                  </pre>
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm italic">
                    Tidak ada data baru
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </LayoutContentBody>
    </LayoutContent>
  );
}
