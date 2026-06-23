export interface StudentElm {
  id: string;
  position: number;
  name: string;
  facultyNumber: string;
  majorName: string;
  majorType: string;
  courseType: string;
  courseSubtype: 'редовно' | 'задочно';
}
