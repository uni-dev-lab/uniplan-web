import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { FacultyElm } from '../../core/interfaces/faculty-elm';
import {API_ENDPOINTS} from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class FacultyService {
   private http = inject(HttpClient);

   refreshNeeded = new Subject<void>();

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
  }): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.faculties}`, faculty).pipe(
      map((res) => {
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
  ): Observable<any> {
    return this.http.put(`${API_ENDPOINTS.faculties}/${id}`, updatedFaculty).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  deleteFaculty(id: string): Observable<any> {
    return this.http.delete(`${API_ENDPOINTS.faculties}/${id}`).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
