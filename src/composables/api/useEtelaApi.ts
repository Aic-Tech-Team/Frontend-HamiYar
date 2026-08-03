import type {
  EtelaCertificateResponse,
  EtelaCertificateRequestModel,
} from "@/types/requests/etela";
import { useStudentStore } from "@/stores/student/useStudentStore";

const MOCK_STORAGE_PREFIX = "mock_etela_certificate_";
const MOCK_NETWORK_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateMockTrackingNumber(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ETELA-${random}`;
}

export const useEtelaApi = () => {
  // const { apiEndpoints } = useApiConfig(); // uncomment for the real version

  async function getEtelaCertificate(trackingNumber: string): Promise<EtelaCertificateResponse> {
    const trimmed = trackingNumber?.trim();
    if (!trimmed) throw new Error("Invalid tracking number");

    await delay(MOCK_NETWORK_DELAY_MS);
    const key = MOCK_STORAGE_PREFIX + trimmed;

    console.log("Looking for:", key);
    console.log("Found:", localStorage.getItem(key));
    const stored = localStorage.getItem(MOCK_STORAGE_PREFIX + trimmed);
    if (!stored) {
      const notFoundError: any = new Error("Mock certificate not found");
      notFoundError.response = { status: 404 };
      throw notFoundError;
    }

    return JSON.parse(stored) as EtelaCertificateResponse;

    // ----- REAL IMPLEMENTATION (swap back once backend confirms) -----
    // const response = await $api.get<EtelaCertificateResponse>(
    //   apiEndpoints.requests.etela.get(trimmed),
    // );
    // if (!response.data) throw new Error("No data received from API");
    // return response.data;
  }

  async function submitEtelaCertificate(
    requestData: EtelaCertificateRequestModel,
  ): Promise<string> {
    await delay(MOCK_NETWORK_DELAY_MS);

    const studentStore = useStudentStore();
    const student = studentStore.student;

    if (!student) {
      throw new Error("Student not found.");
    }
    const trackingNumber = generateMockTrackingNumber();

    const mockResponse: EtelaCertificateResponse = {
      tracking_number: trackingNumber,
      date: new Date().toISOString().slice(0, 10),
      completion_date: requestData.completion_date,

      student: {
        student_number: student.student_number,
        first_name: student.first_name,
        last_name: student.last_name,
        national_id: student.national_id,
        certificate_number: student.certificate_number,
        university: student.university,
      },

      signer: {
        title: "معاون آموزشی",
        full_name: "دکتر کلانتری",
        signature_image: "",
      },

      qr_code_image: "",
    };

    localStorage.setItem(MOCK_STORAGE_PREFIX + trackingNumber, JSON.stringify(mockResponse));
    return trackingNumber;

    // ----- REAL IMPLEMENTATION (swap back once backend confirms) -----
    // const response = await $api.post<SubmitFormResponse>(
    //   apiEndpoints.requests.etela.submit,
    //   requestData,
    // );
    // if (!response.data) throw new Error("No data received from API");
    // return response.data.tracking_number;
  }

  return {
    getEtelaCertificate,
    submitEtelaCertificate,
  };
};
