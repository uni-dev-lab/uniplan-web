import {HttpClient} from '@angular/common/http';
import {inject, Service} from '@angular/core';
import {map, Observable, Subject, tap} from 'rxjs';
import {FacultyElm} from '../../core/interfaces/faculty-elm';
import {API_ENDPOINTS} from '../../config/endpoints';

@Service()
export class FacultyService {
  private readonly http: HttpClient = inject(HttpClient);

  public readonly refreshNeeded: Subject<void> = new Subject<void>();

  public getFaculties(): Observable<FacultyElm[]> {
    return this.http.get<FacultyElm[]>(API_ENDPOINTS.faculties).pipe(
      map((faculties: FacultyElm[]): FacultyElm[] =>
        faculties.map((faculty: FacultyElm, index: number): FacultyElm => ({
          id: faculty.id,
          facultyName: faculty.facultyName,
          location: faculty.location,
          universityId: faculty.universityId,
          position: index + 1,
        }))
      )
    );
  }

  public createFaculty(faculty: {
    universityId: string;
    facultyName: string;
    location: string;
  }): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.faculties}`, faculty).pipe(
      tap((res: void): void => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  public editFaculty(
    id: string,
    updatedFaculty: {
      universityId: string;
      facultyName: string;
      location: string;
    }
  ): Observable<void> {
    return this.http.put<void>(`${API_ENDPOINTS.faculties}/${id}`, updatedFaculty).pipe(
      tap((res: void): void => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  public deleteFaculty(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.faculties}/${id}`).pipe(
      tap((res: void): void => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
