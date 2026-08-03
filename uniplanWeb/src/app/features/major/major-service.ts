import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap, tap } from 'rxjs';
import { MajorElm } from '../../core/interfaces/major-elm';
import { API_ENDPOINTS } from '../../config/endpoints';
import {API_ENDPOINTS} from '../../config/endpoints';
import { CourseElm } from '../../core/interfaces/course-elm';

@Injectable({
  providedIn: 'root',
})
export class MajorService {
  private http = inject(HttpClient);

  refreshNeeded = new Subject<void>();

  getMajors(): Observable<MajorElm[]> {
    return this.http.get<MajorElm[]>(API_ENDPOINTS.majors).pipe(
      map((majors) =>
        majors.map((major, index) => ({
          id: major.id,
          majorName: major.majorName,
          courseId: major.courseId,
          facultyId: major.facultyId,
          courseType: major.courseType,
          courseSubtype: major.courseSubtype,
          position: index + 1,
        }))
      )
    );
  }

  createMajor(createMajor: {
    facultyId: string;
    majorName: string;
  }): Observable<MajorElm> {
    return this.http.post<MajorElm>(`${API_ENDPOINTS.majors}`, createMajor).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  createCourse(course: {
    majorId: string;
    courseYear: number;
    courseType: string;
    courseSubtype: string;
  }): Observable<CourseElm> {
    return this.http.post<CourseElm>(`${API_ENDPOINTS.courses}`, course).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  createMajorWithCourse(majorData: {
    facultyId: string;
    majorName: string;
    type: string;
    subtype: string;
  }): Observable<CourseElm> {
    return this.createMajor({
      facultyId: majorData.facultyId,
      majorName: majorData.majorName,
    }).pipe(
      switchMap((createdMajor) => {
        return this.createCourse({
          majorId: createdMajor.id,
          courseType: majorData.type,
          courseSubtype: majorData.subtype,
          courseYear: 1,
        });
      })
    );
  }

  deleteMajor(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.majors}/${id}`).pipe(
      tap((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.courses}/${courseId}`);
  }

  deleteMajorWithCourse(major: MajorElm): Observable<void> {
    return this.deleteCourse(major.courseId).pipe(
      switchMap(() => this.deleteMajor(major.id))
    );
  }

  editMajor(
    id: string,
    updateMajor: { facultyId: string; majorName: string }
  ): Observable<MajorElm> {
    return this.http.put<MajorElm>(`${API_ENDPOINTS.majors}/${id}`, updateMajor).pipe(
      tap((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
