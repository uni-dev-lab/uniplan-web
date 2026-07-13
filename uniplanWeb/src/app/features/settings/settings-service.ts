import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StudentProfileElm } from '../../core/interfaces/student-profile-elm';
import { LectorProfileElm } from '../../core/interfaces/lector-profile-elm';

const MOCK_STUDENT_PROFILE: StudentProfileElm = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Иван Иванов',
  facultyNumber: '123456',
  majorId: '00000000-0000-0000-0000-000000000001',
  majorName: 'Компютърни науки',
  courseType: 'бакалавър',
  courseSubtype: 'редовно',
  courseYear: 3,
};

const MOCK_LECTOR_PROFILE: LectorProfileElm = {
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
  getCurrentStudent(): Observable<StudentProfileElm> {
    return of(MOCK_STUDENT_PROFILE);
  }

  getCurrentLector(): Observable<LectorProfileElm> {
    return of(MOCK_LECTOR_PROFILE);
  }
}
