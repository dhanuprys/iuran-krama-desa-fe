import { useEffect, useState } from 'react';

import { User } from 'lucide-react';

import { useResidentStore } from '@/stores/resident.store';

import { useIsMobile } from '@/hooks/use-mobile';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export function ResidentSelector() {
  const { residents, activeResident, fetchContextResidents, setActiveResident, loading } =
    useResidentStore();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchContextResidents();
  }, []);

  const handleChange = (value: string) => {
    const selected = residents.find((r) => r.id.toString() === value);
    if (selected) {
      setActiveResident(selected);
      setOpen(false);
    }
  };

  if (loading && residents.length === 0) {
    return <Skeleton className="h-9 w-[200px]" />;
  }

  if (residents.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 w-[200px] justify-between px-3"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {activeResident ? (
                <>
                  <Avatar className="h-5 w-5 rounded-md">
                    <AvatarImage
                      src={activeResident.resident_photo || undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-md">
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">{activeResident.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Pilih Penduduk</span>
              )}
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pilih Penduduk</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[60vh] gap-2 overflow-y-auto py-2">
            {residents.map((resident) => (
              <Button
                key={resident.id}
                variant={activeResident?.id === resident.id ? 'secondary' : 'ghost'}
                className="h-auto justify-start px-4 py-3"
                onClick={() => handleChange(resident.id.toString())}
              >
                <div className="flex w-full items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-md">
                    <AvatarImage
                      src={resident.resident_photo || undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-md">
                      {resident.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                    <span className="w-full truncate text-sm font-medium">{resident.name}</span>
                    <span className="text-muted-foreground text-xs">{resident.nik}</span>
                  </div>
                  {activeResident?.id === resident.id && (
                    <div className="bg-primary h-2 w-2 rounded-full" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Select value={activeResident?.id.toString()} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-[200px]">
        <div className="flex items-center gap-2 overflow-hidden">
          {activeResident ? (
            <>
              <Avatar className="h-5 w-5 rounded-md">
                <AvatarImage
                  src={activeResident.resident_photo || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-md">
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm">{activeResident.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Pilih Penduduk</span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {(residents || []).map((resident) => (
          <SelectItem key={resident.id} value={resident.id.toString()}>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5 rounded-md">
                <AvatarImage src={resident.resident_photo || undefined} className="object-cover" />
                <AvatarFallback className="rounded-md text-[10px]">
                  {resident.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">{resident.name}</span>
                <span className="text-muted-foreground text-xs">{resident.nik}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
