import { Component, OnInit } from '@angular/core';

import { StudentOptions } from '../student-options/student-options';
import { StudentFilters } from '../student-filters/student-filters';
import { StudentTable } from '../student-table/student-table';

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
  majorSuggestions: string[] = []

  ngOnInit(): void {
    
  }
}
