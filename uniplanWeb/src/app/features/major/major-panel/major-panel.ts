import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {catchError, combineLatest, map, merge, of, switchMap} from 'rxjs';

import {MajorElm} from '../../../core/interfaces/major-elm';
import {FacultyService} from '../../faculty/faculty-service';
import {MajorOptions} from '../major-options/major-options';
import {MajorFilters} from '../major-filters/major-filters';
import {MajorTable} from '../major-table/major-table';
import {MajorService} from '../major-service';
import {MajorFilterState} from "../../../core/interfaces/major-filter-state";
import {MajorFilterOptions} from '../../../core/interfaces/major-filter-options';

@Component({
  selector: 'app-major-panel',
  imports: [MajorOptions, MajorFilters, MajorTable],
  templateUrl: './major-panel.html',
  styleUrl: './major-panel.scss'
})
export class MajorPanel implements OnInit {
  private majorService = inject(MajorService);
  private facultyService = inject(FacultyService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  // searchText: string = '';
  // selectedFaculty: string = '';
  // selectedType: string = '';
  // selectedSubtype: string = '';
  //
  // faculties: { id: string; name: string }[] = [];
  // types: string[] = [];
  // subtypes: string[] = [];
  //
  private majors: MajorElm[] = [];
  private facultyMap: Map<string, string> = new Map<string, string>();

  protected internalSearchText: string = '';

  protected majorFiltersState: MajorFilterState = {
    selectedFaculty: '',
    selectedType: '',
    selectedSubtype: '',
  };

  protected majorFilterOptions: MajorFilterOptions = {
    faculties: [],
    types: [],
    subtypes: [],
  }

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
    );

    combineLatest([facultyMap$, majors$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([facultyMap, majors]) => {
        this.facultyMap = facultyMap;
        this.majors = majors;
        const options = MajorTable.getFilterOptions(this.majors, this.facultyMap);

        this.majorFiltersState = {
          ...this.majorFiltersState,

          selectedFaculty: options.faculties.some(
            (f: { id: string, name: string }): boolean => f.id === this.majorFiltersState.selectedFaculty
          ) ? this.majorFiltersState.selectedFaculty : '',

          selectedType: options.types.includes(
            this.majorFiltersState.selectedType
          ) ? this.majorFiltersState.selectedType : '',

          selectedSubtype: options.subtypes.includes(
            this.majorFiltersState.selectedSubtype
          ) ? this.majorFiltersState.selectedSubtype : '',
        };

        this.majorFilterOptions = {
          ...this.majorFilterOptions,
          faculties: options.faculties,
          types: options.types,
          subtypes: options.subtypes
        }
      });
  }
}
