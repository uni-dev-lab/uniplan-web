import { Component, OnInit } from '@angular/core';

import { StudentElm } from '../../../core/interfaces/student-elm';
import { StudentOptions } from '../student-options/student-options';
import { StudentFilters } from '../student-filters/student-filters';
import { StudentTable, ELEMENT_STUDENT_DATA } from '../student-table/student-table';

@Component({
  selector: 'app-student-panel',
  imports: [StudentOptions, StudentFilters, StudentTable],
  templateUrl: './student-panel.html',
  styleUrl: './student-panel.scss'
})
export class StudentPanel implements OnInit {
  searchText = '';
  searchFacNum = '';
  searchMajor = '';
  selectedStudentSubtype = '';
  studentSubtypes: string[] = [];

  ngOnInit(): void {
    const students: StudentElm[] = ELEMENT_STUDENT_DATA;
    this.studentSubtypes = StudentTable.getFilterOptions(students).subtypes;
  }
}
