import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseElm } from '../../core/interfaces/course-elm';
import { API_ENDPOINTS } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);

  getCoursesByMajorId(majorId: string): Observable<CourseElm[]> {
    return this.http.get<CourseElm[]>(`${API_ENDPOINTS.courses}/major/${majorId}`);
  }
}
//placeholder course service to make student form dropdowns work,
//if there is a merge conflict please provide a getCoursesByMajorId-like method wherever it's needed