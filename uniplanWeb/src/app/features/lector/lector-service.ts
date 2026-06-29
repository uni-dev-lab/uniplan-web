import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { LectorElm } from '../../core/interfaces/lector-elm';

@Injectable({
  providedIn: 'root',
})
export class LectorService {
  private apiUrl = 'http://localhost:8080/api/lectors';

  refreshNeeded = new Subject<void>();

  constructor(private http: HttpClient) {}

  getLectors(): Observable<LectorElm[]> {
    return this.http.get<LectorElm[]>(this.apiUrl).pipe(
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
    return this.http.post<LectorElm>(`${this.apiUrl}`, data).pipe(
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
    return this.http.put<LectorElm>(`${this.apiUrl}/${id}`, data).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  deleteLector(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
