import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseElm } from '../../core/interfaces/course-elm';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.testUrl.coursesUrl;
  private http = inject(HttpClient);

  getCoursesByMajorId(majorId: string): Observable<CourseElm[]> {
    return this.http.get<CourseElm[]>(`${this.apiUrl}/major/${majorId}`);
  }
}