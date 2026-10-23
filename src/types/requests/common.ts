// Common types shared between education and internship requests

export interface University {
  id: number;
  name: string;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
}

// Common POST response
export interface SubmitFormResponse {
  tracking_number: string;
}

export type SignerType = "EDUCATION_MANAGER" | "EDUCATION_VICE" | "INTERNSHIP_MANAGER" | "";

export interface Signer {
  full_name: string;
  type?: SignerType;
  title: string | null;
  university: number | null;
  signature_image: string | null;
  is_active?: boolean;
}

export interface CertificateStudent {
  student_number: string;
  certificate_number?: string | null;
  first_name: string;
  last_name: string;
  national_id: string;
  issued_by: string;
  birth_date?: string | null; // ISO date format: "2026-02-01"
  father_name: string;
  field_of_study: string;
  entry_term: string;
  entry_year?: string | null;
  education_level: string;
  education_system: string;
  university: University;
}
