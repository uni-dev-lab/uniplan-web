import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { DepartmentElm } from '../../core/interfaces/department-elm';
import { API_ENDPOINTS } from '../../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  refreshNeeded = new Subject<void>();

  private http = inject(HttpClient);

  getDepartments(): Observable<DepartmentElm[]> {
    return this.http.get<DepartmentElm[]>(API_ENDPOINTS.departments).pipe(
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
  }): Observable<DepartmentElm> {
    return this.http.post<DepartmentElm>(`${API_ENDPOINTS.departments}`, data).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  editDepartment(
    id: string,
    data: { departmentName: string; facultyId: string }
  ): Observable<DepartmentElm> {
    return this.http.put<DepartmentElm>(`${API_ENDPOINTS.departments}/${id}`, data).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.departments}/${id}`).pipe(
      map((res) => {
        this.refreshNeeded.next();
        return res;
      })
    );
  }
}
