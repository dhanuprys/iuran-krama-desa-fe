export interface AuthenticatedUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  can_create_resident?: boolean;
  residents?: Resident[];
}

export interface User extends AuthenticatedUser {
  created_at?: string;
  updated_at?: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  model_type: string;
  model_id: number;
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Resident {
  id: number;
  nik: string;
  family_card_number: string;
  name: string;
  gender: string;
  place_of_birth: string;
  date_of_birth: string;
  family_status: string;
  religion: string;
  education: string;
  work_type: string;
  marital_status: string;
  origin_address: string;
  residential_address: string;
  rt_number: string | null;
  residence_name: string | null;
  house_number: string;
  location: string;
  arrival_date?: string;
  phone: string;
  email: string;
  validation_status: string;
  rejection_reason: string | null;
  resident_status: {
    id: number;
    name: string;
    contribution_amount: number;
  } | null;
  banjar: {
    id: number;
    name: string;
    address: string;
  } | null;
  resident_photo: string | null;
  photo_ktp: string | null;
  photo_house: string | null;
  invoices?: Invoice[];
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  date: string;
  method: string;
  status: 'paid' | 'pending' | 'invalid';
  user_id?: number | null;
  created_at: string;
  updated_at: string;
  invoice?: Invoice;
  user?: User;
}

export interface Invoice {
  id: number;
  resident: Resident;
  invoice_date: string;
  iuran_amount: number;
  peturunan_amount: number;
  dedosan_amount: number;
  total_amount: number;
  payments: Payment[];
  created_at: string;
  updated_at: string;
}

export interface CreateResidentRequest {
  nik: string;
  family_card_number: string;
  name: string;
  gender: 'L' | 'P';
  place_of_birth: string;
  date_of_birth: string;
  family_status: 'HEAD_OF_FAMILY' | 'PARENT' | 'HUSBAND' | 'WIFE' | 'CHILD';
  religion?: string;
  education?: string;
  work_type?: string;
  marital_status?: 'MARRIED' | 'SINGLE' | 'DEAD_DIVORCE' | 'LIVING_DIVORCE';
  origin_address?: string;
  residential_address?: string;
  rt_number?: string;
  residence_name?: string;
  house_number?: string;
  phone?: string;
  email?: string;
  banjar_id?: number;
  // Files are handled separately as FormData usually, but for type consistency:
  photo_house?: File | null;
  resident_photo?: File | null;
  photo_ktp?: File | null;
  resident_status_id?: number;
}

export interface ResidentContext {
  id: number;
  name: string;
  nik: string;
  resident_photo: string | null;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  created_by: number;
  creator?: AuthenticatedUser;
}

export interface Family {
  family_card_number: string;
  head_of_family?: Resident;
  members?: Resident[];
  members_count?: number; // Added from withCount('members')
  created_at?: string;
}
