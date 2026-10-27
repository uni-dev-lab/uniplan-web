export interface LectorFilterState {
  searchText: string;
  faculties: { id: string; name: string }[];
  selectedFaculty: string;
}
