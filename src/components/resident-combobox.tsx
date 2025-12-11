import * as React from 'react';

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import type { Resident } from '@/services/admin-resident.service';
import { apiClient } from '@/lib/api';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { useDebounce } from '@/hooks/use-debounce';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';

interface ResidentComboboxProps {
  value?: number;
  onChange: (value: number) => void;
  onSelect?: (resident: Resident) => void;
  error?: string;
  baseApiUrl?: string; // Optional defaulting to '/admin' for backward compatibility
  additionalFilters?: Record<string, any>;
}

export function ResidentCombobox({
  value,
  onChange,
  onSelect,
  error,
  baseApiUrl = '/admin',
  additionalFilters,
}: ResidentComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedResident, setSelectedResident] = React.useState<Resident | null>(null);
  const [residents, setResidents] = React.useState<Resident[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const debouncedSearch = useDebounce(search, 500);

  // Check if initial value is provided but not in residents list
  const hasInitialValueButMissingData =
    value && (!selectedResident || selectedResident.id !== value);

  // Initial load for value
  React.useEffect(() => {
    if (hasInitialValueButMissingData) {
      fetchResidentDetail(value);
    }
  }, [value, hasInitialValueButMissingData]);

  // Load initial list on mount
  React.useEffect(() => {
    fetchResidents('');
  }, []);

  // Fetch on search
  React.useEffect(() => {
    if (open) {
      fetchResidents(debouncedSearch);
    }
  }, [debouncedSearch, open]);

  const fetchResidentDetail = async (id: number) => {
    try {
      // Construct endpoint: baseApiUrl + '/residents/' + id
      const response = await apiClient.get<HttpResponse<Resident>>(`${baseApiUrl}/residents/${id}`);
      if (response.data.success && response.data.data) {
        setSelectedResident(response.data.data);
        // Ensure the selected resident is in the list
        setResidents((prev) => {
          if (!prev.find((r) => r.id === id)) {
            return [response.data.data!, ...prev];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Failed to fetch resident detail', error);
    }
  };

  const fetchResidents = async (query: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get<PaginatedResponse<Resident>>(`${baseApiUrl}/residents`, {
        params: {
          search: query,
          page: 1,
          per_page: 10, // Limit results for performance
          ...additionalFilters,
        },
      });
      if (response.data.success && response.data.data) {
        setResidents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to search residents', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              !value ? 'text-muted-foreground' : '',
              error ? 'border-destructive text-destructive' : '',
            )}
          >
            {selectedResident
              ? `${selectedResident.name} - ${selectedResident.nik}`
              : 'Pilih penduduk...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Cari nama, NIK, atau no. HP..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  'Tidak ada data penduduk ditemukan.'
                )}
              </CommandEmpty>
              <CommandGroup>
                {residents.map((resident) => (
                  <CommandItem
                    key={resident.id}
                    value={resident.id.toString()}
                    onSelect={() => {
                      setSelectedResident(resident);
                      onChange(resident.id);
                      if (onSelect) {
                        onSelect(resident);
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === resident.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{resident.name}</span>
                      <span className="text-muted-foreground text-xs">{resident.nik}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
