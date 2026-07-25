export interface ContactRequestModel {
  phone: string;
  subject: string;
  email?: string;
  message?: string;
}

export interface ContactSubmitResponse {
  detail: string;
}
