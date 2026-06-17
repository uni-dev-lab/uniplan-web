import { Component, OnInit } from '@angular/core';

import { StudentElm } from '../../../core/interfaces/student-elm';
import { StudentOptions } from '../student-options/student-options';
import { StudentFilters } from '../student-filters/student-filters';
import { StudentTable, ELEMENT_STUDENT_DATA } from '../student-table/student-table';

@Component({
  selector: 'app-student-panel',
  standalone: true,
  imports: [StudentOptions, StudentFilters, StudentTable],
  templateUrl: './student-panel.html',
})
export class StudentPanel implements OnInit {
  searchText = '';
  searchFacNum = '';
  searchMajor = '';
  selectedStudentSubtype = '';
  studentSubtypes: string[] = [];

  students: StudentElm[] = ELEMENT_STUDENT_DATA;

  ngOnInit(): void {
    this.studentSubtypes = StudentTable.getFilterOptions(this.students).subtypes;
  }
}
