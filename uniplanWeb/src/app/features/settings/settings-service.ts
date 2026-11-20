import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StudentProfile } from '../../core/interfaces/student-profile';

// TODO: Placeholder data. Wire getCurrentStudent() to the backend /students endpoint
// once login is implemented and provides the logged-in student's id.
const MOCK_STUDENT_PROFILE: StudentProfile = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Иван Иванов',
  facultyNumber: '123456',
  majorId: '00000000-0000-0000-0000-000000000001',
  majorName: 'Компютърни науки',
  courseType: 'бакалавър',
  courseSubtype: 'редовно',
  courseYear: 3,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  getCurrentStudent(): Observable<StudentProfile> {
    return of(MOCK_STUDENT_PROFILE);
  }
}
