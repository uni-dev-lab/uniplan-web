export interface StudentElm {
  id: string;
  position: number;
  name: string;
  facultyNumber: string;
  majorId: string;
  majorName: string;
  courseType: string;
  courseSubtype: 'редовно' | 'задочно';
  courseYear: number;
}
