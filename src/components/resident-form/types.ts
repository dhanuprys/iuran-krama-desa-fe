export interface ResidentFormData {
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
  rt_number: string;
  residence_name: string;
  house_number: string;
  phone: string;
  email: string;
  banjar_id: string;
  resident_status_id: string;
}

export interface ResidentFormFiles {
  photo_house: File | null;
  resident_photo: File | null;
  photo_ktp: File | null;
}
