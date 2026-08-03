// گواهی طرح اعتلا (Ela National Plan) certificate API types
import type { Signer, CertificateStudent } from "./common";

export interface EtelaCertificateResponse {
  student: CertificateStudent;
  signer: Signer;
  completion_date: string; // ISO date: "2026-02-08"
  qr_code_image: string;
  qr_url?: string;
  date: string; // ISO date
  tracking_number?: string;
}

// Ela certificate POST request body
export interface EtelaCertificateRequestModel {
  student_number: string;
  completion_date: string;
}

// Form data structure matching ElaFormView for UI
export interface EtelaFormData {
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
    idNumber: string;
    photoUrl: string;
  };
  completionDate: string; // ISO date (YYYY-MM-DD) from DatePicker
  signature: {
    title: string;
    name: string;
    imageUrl: string;
  }[];
}
