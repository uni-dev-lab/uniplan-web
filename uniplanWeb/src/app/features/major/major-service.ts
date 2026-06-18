import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { MajorElm } from '../../core/interfaces/major-elm';
import {environment} from '../../../environments/environment';
import {API_ENDPOINTS} from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class MajorService {
  refreshNeeded = new Subject<void>();

  constructor(private http: HttpClient) {}

  getMajors(): Observable<MajorElm[]> {
    return this.http.get<MajorElm[]>(API_ENDPOINTS.courses).pipe(
      map((majors) =>
        majors.map((major, index) => ({
          majorId: major.majorId,
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
  }): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.majors}`, createMajor).pipe(
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
  }): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.courses}`, course).pipe(
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
  }): Observable<any> {
    return this.createMajor({
      facultyId: majorData.facultyId,
      majorName: majorData.majorName,
    }).pipe(
      switchMap((createdMajor: any) => {
        return this.createCourse({
          majorId: createdMajor.id,
          courseType: majorData.type,
          courseSubtype: majorData.subtype,
          courseYear: 1,
        });
      })
    );
  }

  deleteMajor(id: string): Observable<any> {
    return this.http.delete(`${API_ENDPOINTS.majors}/${id}`).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${API_ENDPOINTS.courses}/${courseId}`);
  }

  deleteMajorWithCourse(major: MajorElm): Observable<any> {
    return this.deleteCourse(major.courseId).pipe(
      switchMap(() => this.deleteMajor(major.majorId))
    );
  }

  editMajor(
    id: string,
    updateMajor: { facultyId: string; majorName: string }
  ): Observable<any> {
    return this.http.put(`${API_ENDPOINTS.majors}/${id}`, updateMajor).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
