import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { DepartmentElm } from '../../core/interfaces/department-elm';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8080/api/departments';

  refreshNeeded = new Subject<void>();

  private http = inject(HttpClient);

  getDepartments(): Observable<DepartmentElm[]> {
    return this.http.get<DepartmentElm[]>(this.apiUrl).pipe(
      map((departments) =>
        departments.map((dept, index) => ({
          id: dept.id,
          departmentName: dept.departmentName,
          facultyId: dept.facultyId,
          position: index + 1,
        }))
      )
    );
  }

  createDepartment(data: {
    departmentName: string;
    facultyId: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  editDepartment(
    id: string,
    data: { departmentName: string; facultyId: string }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
