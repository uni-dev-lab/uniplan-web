export interface FacultyApiResponse {
  id: string;
  universityId: string;
  facultyName: string;
  location: string;
}

export interface FacultyElm {
  id: string;
  facultyName: string;
  position: number;
  location: string;
  universityId: string;
}
