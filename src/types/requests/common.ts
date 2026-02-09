// Common types shared between education and internship requests

export interface University {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
}

// Common POST response
export interface SubmitFormResponse {
  tracking_number: string;
}

export interface Signer {
  full_name: string;
  title: string;
  university: number;
  signature_image: string;
  is_active: boolean;
}

export interface CertificateStudent {
  student_number: string;
  certificate_number: string;
  first_name: string;
  last_name: string;
  national_id: string;
  issued_by: string;
  birth_date: string; // ISO date format: "2026-02-01"
  father_name: string;
  field_of_study: string;
  entry_term: string;
  entry_year: string;
  education_level: string;
  education_system: string;
  university: University;
}
