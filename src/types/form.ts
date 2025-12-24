export type FormValidationErrors = Record<string, string[]>;

export interface FormErrorProps {
  errors?: FormValidationErrors | null;
}
