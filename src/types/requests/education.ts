// Education certificate API types
import type { Signer, CertificateStudent } from "./common";

export interface EducationCertificateResponse {
  student: CertificateStudent;
  signer: Signer;
  academic_term: string;
  academic_year: string;
  expiration_date: string; // ISO date: "2026-02-08"
  certificate: string; // API typo - recipient/organization name
  description: string;
  qr_code_image: string;
  qr_url?: string;
  date: string; // ISO date
  tracking_number?: string;
}

// Education certificate POST request body
export interface EducationCertificateRequestModel {
  student_number: string;
  academic_term: string;
  academic_year: string;
  certificate: string;
  description: string;
}

// Form data structure matching EducationFormView for UI
export interface EducationFormData {
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
    fatherName: string;
    idNumber: string;
    birthPlace: string;
    birthDate: string; // Jalali date for display
    photoUrl: string;
  };
  education: {
    field: string;
    degreeType: string;
    method: string;
    entrySemester: string;
    entryAcademicYear: string;
    currentSemester: string;
    currentAcademicYear: string;
  };
  certificate: {
    recipient: string;
    validityDate: string; // ISO date (YYYY-MM-DD) from DatePicker
  };
  description: string;
  signature: {
    title: string;
    name: string;
    imageUrl: string;
  };
}
