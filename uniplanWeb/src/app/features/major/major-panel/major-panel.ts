import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MajorElm } from '../../../core/interfaces/major-elm';
import { FacultyService } from '../../faculty/faculty-service';
import { MajorOptions } from '../major-options/major-options';
import { MajorFilters } from '../major-filters/major-filters';
import { MajorTable } from '../major-table/major-table';
import { MajorService } from '../major-service';

@Component({
  selector: 'app-major-panel',
  imports: [MajorOptions, MajorFilters, MajorTable],
  templateUrl: './major-panel.html',
  styleUrl: './major-panel.scss'
})
export class MajorPanel implements OnInit {
  searchText = '';
  selectedFaculty = '';
  selectedType = '';
  selectedSubtype = '';

  faculties: { id: string; name: string }[] = [];
  types: string[] = [];
  subtypes: string[] = [];

  private majors: MajorElm[] = [];
  private facultyMap = new Map<string, string>();

  constructor(
    private majorService: MajorService,
    private facultyService: FacultyService
  ) {
    this.majorService.refreshNeeded
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.loadFilters());
  }

  ngOnInit(): void {
    this.loadFilters();
  }

  private loadFilters(): void {
    this.facultyService.getFaculties().subscribe((faculties) => {
      this.facultyMap = new Map(faculties.map((f) => [f.id, f.facultyName]));
      this.majorService.getMajors().subscribe((data) => {
        this.majors = data;
        const options = MajorTable.getFilterOptions(this.majors, this.facultyMap);
        this.faculties = options.faculties;
        this.types = options.types;
        this.subtypes = options.subtypes;
      });
    });
  }
}
