import { environment } from '../../environments/environment';

export const API_ENDPOINTS = {
  universities: `${environment.baseUrl}/universities`,
  courses: `${environment.baseUrl}/courses`,
  faculties: `${environment.baseUrl}/faculties`,
  majors: `${environment.baseUrl}/majors`,
  lectors: `${environment.baseUrl}/lectors`,
  rooms: `${environment.baseUrl}/rooms`,
};
