// Internship letter API types
import type { Signer, CertificateStudent } from "./common";

export interface InternshipCompany {
  address: string;
  phone: string;
  hr_email: string;
  postal_code: string;
  name: string;
  department: string;
}

export interface InternshipResponse {
  student: CertificateStudent;
  company: InternshipCompany;
  time: string;
  teacher: string;
  disciplinarian: boolean;
  signer: Signer;
  qr_code_image: string;
  qr_url?: string;
  course: string;
  date: string; // ISO date
  tracking_number?: string;
}

// Internship letter POST request body
export interface InternshipRequestModel {
  student_number: string;
  company_name: string;
  company_postal_code: string;
  company_address: string;
  company_department: string;
  time: string;
  course: string;
  teacher: string;
  disciplinarian: boolean;
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
