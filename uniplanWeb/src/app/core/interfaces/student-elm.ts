import { CourseSubtype } from "../../features/course/course-subtype";

export interface StudentElm {
  id: string;
  position: number;
  name: string;
  facultyNumber: string;
  majorId: string;
  majorName: string;
  courseType: string;
  courseSubtype: CourseSubtype;
  courseYear: number;
}
