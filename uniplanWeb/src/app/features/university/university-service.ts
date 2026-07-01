import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {API_ENDPOINTS} from '../../config/endpoints';

export interface UniversityElm {
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
  constructor(private http: HttpClient) {}

  getAllUniversities(): Observable<UniversityElm[]> {
    return this.http.get<UniversityElm[]>(API_ENDPOINTS.universities);
  }
}
