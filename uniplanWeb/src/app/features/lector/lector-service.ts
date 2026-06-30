import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { LectorElm } from '../../core/interfaces/lector-elm';
import { API_ENDPOINTS } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class LectorService {
  refreshNeeded = new Subject<void>();

  constructor(private http: HttpClient) {}

  getLectors(): Observable<LectorElm[]> {
    return this.http.get<LectorElm[]>(API_ENDPOINTS.lectors).pipe(
      map((lectors) =>
        lectors.map((lector, index) => ({
          id: lector.id,
          firstName: lector.firstName,
          lastName: lector.lastName,
          email: lector.email,
          facultyId: lector.facultyId,
          position: index + 1,
        }))
      )
    );
  }

  createLector(data: {
    firstName: string;
    lastName: string;
    email: string;
    facultyId: string;
  }): Observable<LectorElm> {
    return this.http.post<LectorElm>(`${API_ENDPOINTS.lectors}`, data).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  editLector(
    id: string,
    data: { firstName: string; lastName: string; email: string; facultyId: string }
  ): Observable<LectorElm> {
    return this.http.put<LectorElm>(`${API_ENDPOINTS.lectors}/${id}`, data).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  deleteLector(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.lectors}/${id}`).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
