import { Component } from '@angular/core';
import { FacultyOptions } from '../../../features/faculty/faculty-options/faculty-options';
import { ViewService } from './view.service';
import { CommonModule } from '@angular/common';
import { MajorOptions } from '../../../features/major/major-options/major-options';
import { FacultyTable } from '../../../features/faculty/faculty-table/faculty-table';
import {
  MajorTable,
  ELEMENT_DATA,
} from '../../../features/major/major-table/major-table';
import { MajorFilters } from '../../../features/major/major-filters/major-filters';

@Component({
  selector: 'app-main-panel',
  imports: [
    CommonModule,
    FacultyOptions,
    MajorOptions,
    FacultyTable,
    MajorTable,
    MajorFilters,
  ],
  standalone: true,
  templateUrl: './main-panel.html',
  styleUrl: './main-panel.scss',
})
export class MainPanel {
  currentView = 'home';

  constructor(private viewService: ViewService) {
    this.viewService.currentView$.subscribe((view) => {
      this.currentView = view;
    });
  }

  majors = ELEMENT_DATA;

  searchText = '';

  selectedFaculty = '';
  selectedType = '';
  selectedSubtype = '';

  faculties: string[] = [];
  types: string[] = [];
  subtypes: string[] = [];

  ngOnInit(): void {
    const filterOptions = MajorTable.getFilterOptions(this.majors);
    this.faculties = filterOptions.faculties;
    this.types = filterOptions.types;
    this.subtypes = filterOptions.subtypes;
  }
}
