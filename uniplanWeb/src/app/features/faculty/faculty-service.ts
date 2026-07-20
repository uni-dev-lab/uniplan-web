import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { FacultyElm } from '../../core/interfaces/faculty-elm';
import { API_ENDPOINTS } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class FacultyService {
  refreshNeeded = new Subject<void>();

  constructor(private http: HttpClient) { }

  getFaculties(): Observable<FacultyElm[]> {
    return this.http.get<FacultyElm[]>(API_ENDPOINTS.faculties).pipe(
      map((faculties) =>
        faculties.map((faculty, index) => ({
          id: faculty.id,
          facultyName: faculty.facultyName,
          location: faculty.location,
          universityId: faculty.universityId,
          position: index + 1,
        }))
      )
    );
  }

  createFaculty(faculty: {
    universityId: string;
    facultyName: string;
    location: string;
  }): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.faculties}`, faculty).pipe(
      tap((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  editFaculty(
    id: string,
    updatedFaculty: {
      universityId: string;
      facultyName: string;
      location: string;
    }
  ): Observable<void> {
    return this.http.put<void>(`${API_ENDPOINTS.faculties}/${id}`, updatedFaculty).pipe(
      tap((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  deleteFaculty(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.faculties}/${id}`).pipe(
      tap((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
