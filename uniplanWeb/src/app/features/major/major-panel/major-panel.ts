import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {catchError, combineLatest, map, merge, of, switchMap } from 'rxjs';

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
  private destroyRef = inject(DestroyRef);

  constructor(
    private majorService: MajorService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    const facultyMap$ = merge(of(undefined), this.facultyService.refreshNeeded).pipe(
          switchMap(() =>
            this.facultyService.getFaculties().pipe(
              map((faculties) => new Map(faculties.map((f) => [f.id, f.facultyName]))),
              catchError(() => of(this.facultyMap)),
            ),
          ),
        );
        const majors$ = merge(of(undefined), this.majorService.refreshNeeded).pipe(
          switchMap(() =>
            this.majorService.getMajors().pipe(
              catchError(() => of(this.majors)),
            ),
          ),
        )

    combineLatest([facultyMap$, majors$])
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(([facultyMap, majors]) => {
            this.facultyMap = facultyMap;
            this.majors = majors;
            const options = MajorTable.getFilterOptions(this.majors, this.facultyMap);
            this.faculties = options.faculties;
            this.types = options.types;
            this.subtypes = options.subtypes;

            if (this.selectedFaculty && !this.faculties.some((f) => f.id === this.selectedFaculty)) {
              this.selectedFaculty = '';
            }
            if (this.selectedType && !this.types.includes(this.selectedType)) {
              this.selectedType = '';
            }
            if (this.selectedSubtype && !this.subtypes.includes(this.selectedSubtype)) {
              this.selectedSubtype = '';
            }
          });
  }
}
