import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {API_ENDPOINTS} from '../../config/endpoints';

export interface University {
  id: string;
  uniName: string;
  location: string;
  establishedYear: number;
  accreditation: string;
  website: string;
}

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private http = inject(HttpClient);

  getAllUniversities(): Observable<University[]> {
    return this.http.get<University[]>(API_ENDPOINTS.universities);
  }
}
