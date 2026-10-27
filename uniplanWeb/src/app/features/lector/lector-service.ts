import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {Lector} from '../../core/interfaces/lector';

import {API_ENDPOINTS} from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class LectorService {
  private readonly http: HttpClient = inject(HttpClient);

  readonly refreshNeeded: Subject<void> = new Subject<void>();

  public getLectors(): Observable<Lector[]> {
    return this.http.get<Lector[]>(API_ENDPOINTS.lectors).pipe(
      map((lectors: Lector[]): Lector[] =>
        lectors.map((lector: Lector, index: number): Lector => ({
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

  public createLector(data: {
    firstName: string;
    lastName: string;
    email: string;
    facultyId: string;
  }): Observable<Lector> {
    return this.http.post<Lector>(`${API_ENDPOINTS.lectors}`, data).pipe(
      map((res: Lector): Lector => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  public editLector(
    id: string,
    data: { firstName: string; lastName: string; email: string; facultyId: string }
  ): Observable<Lector> {
    return this.http.put<Lector>(`${API_ENDPOINTS.lectors}/${id}`, data).pipe(
      map((res: Lector): Lector => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  public deleteLector(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.lectors}/${id}`).pipe(
      map((res: void): void => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
