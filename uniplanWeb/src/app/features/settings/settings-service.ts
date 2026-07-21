import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StudentProfile } from '../../core/interfaces/student-profile';
import { LectorProfile } from '../../core/interfaces/lector-profile';

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

const MOCK_LECTOR_PROFILE: LectorProfile = {
  id: '00000000-0000-0000-0000-000000000002',
  facultyId: '00000000-0000-0000-0000-000000000003',
  email: 'georgi.goshov@uni.bg',
  firstName: 'Георги',
  lastName: 'Гошов',
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  getCurrentStudent(): Observable<StudentProfile> {
    return of(MOCK_STUDENT_PROFILE);
  }

  getCurrentLector(): Observable<LectorProfile> {
    return of(MOCK_LECTOR_PROFILE);
  }
}
