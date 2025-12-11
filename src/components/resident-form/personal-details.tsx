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

interface PersonalDetailsProps {
  formData: ResidentFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function PersonalDetails({
  formData,
  handleChange,
  handleSelectChange,
}: PersonalDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Pribadi</CardTitle>
        <CardDescription>Informasi utama identitas penduduk.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>NIK (Nomor Induk Kependudukan)</FieldLabel>
            <FieldContent>
              <Input
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="16 digit NIK"
                maxLength={16}
                className="text-lg"
                required
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Nomor Kartu Keluarga</FieldLabel>
            <FieldContent>
              <Input
                name="family_card_number"
                value={formData.family_card_number}
                onChange={handleChange}
                placeholder="16 digit No KK"
                maxLength={16}
                className="text-lg"
                required
              />
            </FieldContent>
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel>Nama Lengkap</FieldLabel>
          <FieldContent>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama sesuai KTP"
              className="text-lg font-medium"
              required
            />
          </FieldContent>
        </Field>

        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Jenis Kelamin</FieldLabel>
            <FieldContent>
              <Select
                value={formData.gender}
                onValueChange={(val) => handleSelectChange('gender', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Golongan Darah (Opsional)</FieldLabel>
            <FieldContent>
              <div className="text-muted-foreground pt-2 text-sm">Tidak tersedia di form ini</div>
            </FieldContent>
          </Field>
        </FieldGroup>

        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Tempat Lahir</FieldLabel>
            <FieldContent>
              <Input
                name="place_of_birth"
                value={formData.place_of_birth}
                onChange={handleChange}
                required
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Tanggal Lahir</FieldLabel>
            <FieldContent>
              <Input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </FieldContent>
          </Field>
        </FieldGroup>

        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Status Keluarga</FieldLabel>
            <FieldContent>
              <Select
                value={formData.family_status}
                onValueChange={(val) => handleSelectChange('family_status', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HEAD_OF_FAMILY">Kepala Keluarga</SelectItem>
                  <SelectItem value="HUSBAND">Suami</SelectItem>
                  <SelectItem value="WIFE">Istri</SelectItem>
                  <SelectItem value="CHILD">Anak</SelectItem>
                  <SelectItem value="PARENT">Orang Tua</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Status Perkawinan</FieldLabel>
            <FieldContent>
              <Select
                value={formData.marital_status}
                onValueChange={(val) => handleSelectChange('marital_status', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MARRIED">Kawin</SelectItem>
                  <SelectItem value="SINGLE">Belum Kawin</SelectItem>
                  <SelectItem value="DEAD_DIVORCE">Cerai Mati</SelectItem>
                  <SelectItem value="LIVING_DIVORCE">Cerai Hidup</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
