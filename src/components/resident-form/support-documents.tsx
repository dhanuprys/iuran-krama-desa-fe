import { UploadCloud } from 'lucide-react';

import type { FormValidationErrors } from '@/types/form';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldError } from '@/components/ui/field';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { getFieldErrors } from '@/lib/utils';

import type { ResidentFormFiles } from './types';

interface SupportDocumentsProps {
  files: ResidentFormFiles;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: FormValidationErrors | null;
}

export function SupportDocuments({ files, handleFileChange, errors }: SupportDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumen Pendukung</CardTitle>
        <CardDescription>Upload foto dokumen anda. Pastikan terlihat jelas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Field>
          <FieldLabel>Foto Diri (Wajah Jelas)</FieldLabel>
          <FieldContent>
            <div className="flex items-center gap-4">
              <Input
                name="resident_photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {files.resident_photo && (
                <span className="text-sm text-green-600">
                  <UploadCloud className="inline h-4 w-4" /> Terpilih
                </span>
              )}
            </div>
            <FieldError errors={getFieldErrors(errors, 'resident_photo')} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Foto KTP</FieldLabel>
          <FieldContent>
            <div className="flex items-center gap-4">
              <Input name="photo_ktp" type="file" accept="image/*" onChange={handleFileChange} />
              {files.photo_ktp && (
                <span className="text-sm text-green-600">
                  <UploadCloud className="inline h-4 w-4" /> Terpilih
                </span>
              )}
            </div>
            <FieldError errors={getFieldErrors(errors, 'photo_ktp')} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Foto Rumah (Tampak Depan)</FieldLabel>
          <FieldContent>
            <div className="flex items-center gap-4">
              <Input name="photo_house" type="file" accept="image/*" onChange={handleFileChange} />
              {files.photo_house && (
                <span className="text-sm text-green-600">
                  <UploadCloud className="inline h-4 w-4" /> Terpilih
                </span>
              )}
            </div>
            <FieldError errors={getFieldErrors(errors, 'photo_house')} />
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}
