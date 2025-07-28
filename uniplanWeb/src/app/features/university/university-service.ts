import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface UniversityElm {
  id: string;
  uniName: string;
  position: number;
  location: string;
  establishedYear: number;
  accreditation: string;
  website: string;
}

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private apiUrl = 'http://localhost:8080/universities';

  constructor(private http: HttpClient) {}

  getAllUniversities(): Observable<{ id: string; uniName: string }[]> {
    return this.http.get<{ id: string; uniName: string }[]>(this.apiUrl);
  }
}
