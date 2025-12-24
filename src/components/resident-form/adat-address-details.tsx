import type { ResidentStatus } from '@/services/resident-status.service';

import { MapPicker } from '@/components/map-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ResidentFormData } from './types';

interface AdatAndAddressDetailsProps {
  formData: ResidentFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  banjars: { id: number; name: string }[];
  residentStatuses: ResidentStatus[];
  location: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number } | null) => void;
}

export function AdatAndAddressDetails({
  formData,
  handleChange,
  handleSelectChange,
  banjars,
  residentStatuses,
  location,
  setLocation,
}: AdatAndAddressDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Adat & Alamat</CardTitle>
        <CardDescription>Status kependudukan adat dan lokasi tinggal.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup className="grid gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel>Banjar Adat</FieldLabel>
            <FieldContent>
              <Select
                value={formData.banjar_id}
                onValueChange={(val) => handleSelectChange('banjar_id', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Banjar" />
                </SelectTrigger>
                <SelectContent>
                  {banjars.map((banjar) => (
                    <SelectItem key={banjar.id} value={banjar.id.toString()}>
                      {banjar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Status Krama (Iuran)</FieldLabel>
            <FieldContent>
              <Select
                value={formData.resident_status_id}
                onValueChange={(val) => handleSelectChange('resident_status_id', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status Krama" />
                </SelectTrigger>
                <SelectContent>
                  {residentStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </FieldGroup>

        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Alamat Asal (Sesuai KTP)</FieldLabel>
            <FieldContent>
              <Input
                name="origin_address"
                value={formData.origin_address}
                onChange={handleChange}
                placeholder="Jl..."
                required
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Alamat Domisili (Di Desa)</FieldLabel>
            <FieldContent>
              <Input
                name="residential_address"
                value={formData.residential_address}
                onChange={handleChange}
                placeholder="Jl..."
                required
              />
            </FieldContent>
          </Field>
        </FieldGroup>
        <FieldGroup className="grid gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel>Nomor RT</FieldLabel>
            <FieldContent>
              <Input
                name="rt_number"
                value={formData.rt_number}
                onChange={handleChange}
                placeholder="005"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Perumahan</FieldLabel>
            <FieldContent>
              <Input
                name="residence_name"
                value={formData.residence_name}
                onChange={handleChange}
                placeholder="Nama Perumahan (Contoh: Griya Asri)"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Nomor Rumah</FieldLabel>
            <FieldContent>
              <Input
                name="house_number"
                value={formData.house_number}
                onChange={handleChange}
                placeholder="No. 123"
              />
            </FieldContent>
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel>Lokasi Rumah (GPS)</FieldLabel>
          <FieldContent>
            <div className="overflow-hidden rounded-lg border">
              <MapPicker value={location} onChange={setLocation} />
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              Klik pada peta untuk menandai lokasi rumah.{' '}
              {location
                ? `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`
                : 'Belum memilih lokasi.'}
            </div>
          </FieldContent>
        </Field>

        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>No. Handphone / WA</FieldLabel>
            <FieldContent>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="08..."
                type="tel"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Email (Opsional)</FieldLabel>
            <FieldContent>
              <Input name="email" value={formData.email} onChange={handleChange} type="email" />
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
