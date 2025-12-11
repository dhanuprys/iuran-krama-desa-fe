import { UploadCloud } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import type { ResidentFormFiles } from './types';

interface SupportDocumentsProps {
  files: ResidentFormFiles;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SupportDocuments({ files, handleFileChange }: SupportDocumentsProps) {
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
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}
