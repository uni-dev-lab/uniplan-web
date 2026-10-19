export interface MajorFilterState {
  internalSearchText: string;
  faculties: { id: string; name: string }[];
  types: string[];
  subtypes: string[];
  selectedFaculty: string;
  selectedType: string;
  selectedSubtype: string;
}
