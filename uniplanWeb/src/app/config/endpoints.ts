import { environment } from '../../environments/environment';

export const API_ENDPOINTS = {
  universities: `${environment.baseUrl}/universities`,
  courses: `${environment.baseUrl}/courses`,
  faculties: `${environment.baseUrl}/faculties`,
  majors: `${environment.baseUrl}/majors`,
  categories: `${environment.baseUrl}/categories`,
  rooms: `${environment.baseUrl}/rooms`,
};
