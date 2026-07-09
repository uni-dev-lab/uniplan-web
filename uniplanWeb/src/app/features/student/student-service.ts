import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StudentElm } from '../../core/interfaces/student-elm';
import { API_ENDPOINTS } from '../../config/endpoints';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private apiUrl = API_ENDPOINTS.students;

    refreshNeeded = new Subject<void>();

    private http = inject(HttpClient);

    getStudents(): Observable<StudentElm[]> {
        return this.http.get<StudentElm[]>(this.apiUrl).pipe(
            map((students) =>
                students.map((student, index) => ({
                    id: student.id,
                    position: index + 1,
                    name: student.name,
                    facultyNumber: student.facultyNumber,
                    majorId: student.majorId,
                    majorName: student.majorName,
                    courseType: student.courseType,
                    courseSubtype: student.courseSubtype,
                    courseYear: student.courseYear,
                }))
            )
        );
    }
    createStudent(student: { firstName: string; lastName: string; facultyNumber: string; courseId: string }): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}`, student).pipe(
            map((res) => {
                this.refreshNeeded.next();
                return res;
            })
        );
    }

    editStudent(id: string,
         updatedStudent: Omit<StudentElm, 'position' | 'id'>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, updatedStudent).pipe(
            map((res) => {
                this.refreshNeeded.next();
                return res;
            })
        );
    }

    deleteStudent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            map((res) => {
                this.refreshNeeded.next();
                return res;
            })
        );
    }
}