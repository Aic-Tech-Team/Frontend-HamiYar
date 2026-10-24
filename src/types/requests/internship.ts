// Internship letter API types
import type { Signer, CertificateStudent } from "./common";

export type InternshipStatus = "pending" | "issued" | "invalid";

export interface InternshipResponse {
  student: CertificateStudent;
  signer: Signer;
  company_name: string;
  department: string;
  workplace_address: string;
  postal_code: string;
  internship_title: string;
  duration_hours: number;
  internship_instructor: string;
  has_disciplinary_issue?: boolean;
  expiration_date?: string; // ISO date
  qr_code_image: string | null;
  qr_url?: string | null;
  date: string; // ISO date
  tracking_number: string;
  status: InternshipStatus;
}

// Internship letter POST request body
export interface InternshipRequestModel {
  student_number: string;
  company_name: string;
  department: string;
  workplace_address: string;
  postal_code: string;
  internship_title: string;
  duration_hours: number;
  internship_instructor: string;
  has_disciplinary_issue?: boolean;
}

export interface InternshipCreateResponse {
  message: string;
  internship_id: number;
  tracking_number: string;
  url: string | null;
}

// Form data structure matching InternshipFormView for UI
export interface InternshipFormData {
  header: {
    university: string;
    city: string;
    date: string;
    number: string;
    attachment: string;
  };
  student: {
    code: string;
    fullName: string;
  };
  education: {
    field: string;
    entryAcademicYear: string;
    degreeType: string;
    system: string;
  };
  internship: {
    course: string;
    duration: string;
    instructor: string;
    companyName: string;
    address: string;
    postalCode: string;
    department: string;
    disciplinarian: boolean;
  };
  signature: {
    title: string;
    name: string;
    imageUrl: string;
  };
}


export interface InternshipVerification {
  status: InternshipStatus;
  tracking_number: string;
}

export interface InternshipManagerListItem {
  id: number;
  student_name: string;
  student_number: string;
  national_id: string;
  company_name: string;
  internship_title: string;
  tracking_number: string;
  status: InternshipStatus;
  created_at: string;
  approved_at: string | null;
}

export interface InternshipManagerDetail {
  id: number;
  tracking_number: string;
  status: InternshipStatus;
  student_detail?: {
    first_name?: string;
    last_name?: string;
    student_number?: string;
    national_id?: string;
  };
  company_name: string;
  department: string;
  workplace_address: string;
  postal_code: string;
  internship_title: string;
  duration_hours: number;
  internship_instructor: string;
  has_disciplinary_issue: boolean;
  created_at: string;
  expiration_date?: string;
  approved_at: string | null;
  approved_by: number | null;
  qr_url: string | null;
  qr_code_image: string | null;
}

export interface InternshipApprovalResult {
  id: number;
  tracking_number: string;
  status: InternshipStatus;
  approved_at: string;
  already_approved: boolean;
  qr_url: string | null;
  qr_code_image: string | null;
}
