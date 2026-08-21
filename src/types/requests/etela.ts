import type { Signer, CertificateStudent } from "./common";

export type EtelaGender = "female" | "male";

export interface EtelaCertificateResponse {
  student: CertificateStudent;
  signer: Signer;
  gender: EtelaGender;
  course_date: string;
  expiration_date?: string;
  certificate?: string | null;
  description?: string | null;
  qr_code_image: string;
  qr_url?: string | null;
  certificate_text?: string;
  date: string;
  tracking_number?: string;
}

export interface EtelaCertificateRequestModel {
  student_number: string;
  gender: EtelaGender;
  course_date: string;
  certificate?: string;
  description?: string;
}

export interface EtelaCertificateCreateResponse {
  message?: string;
  ela_id?: number;
  tracking_number: string;
}

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
  gender: EtelaGender | "";
  courseDate: string;
  certificate: string;
  description: string;
  signature: {
    title: string;
    name: string;
    imageUrl: string;
  };
}
