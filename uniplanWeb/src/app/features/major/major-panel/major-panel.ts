import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {catchError, combineLatest, map, merge, Observable, of, switchMap} from 'rxjs';

import {MajorElm} from '../../../core/interfaces/major-elm';
import {FacultyService} from '../../faculty/faculty-service';
import {MajorOptions} from '../major-options/major-options';
import {MajorFilters} from '../major-filters/major-filters';
import {MajorTable} from '../major-table/major-table';
import {MajorService} from '../major-service';
import {MajorFilterState} from "../../../core/interfaces/major-filter-state";
import {MajorFilterOptions} from '../../../core/interfaces/major-filter-options';
import {FacultyElm} from '../../../core/interfaces/faculty-elm';

@Component({
  selector: 'app-major-panel',
  imports: [MajorOptions, MajorFilters, MajorTable],
  templateUrl: './major-panel.html',
  styleUrl: './major-panel.scss'
})
export class MajorPanel implements OnInit {
  private majorService: MajorService = inject(MajorService);
  private facultyService: FacultyService = inject(FacultyService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  private majors: MajorElm[] = [];
  private facultyMap: Map<string, string> = new Map<string, string>();

  protected internalSearchText: WritableSignal<string> = signal('');

  protected majorFiltersState: WritableSignal<MajorFilterState> = signal({
    selectedFaculty: '',
    selectedType: '',
    selectedSubtype: '',
  });

  protected majorFilterOptions: WritableSignal<MajorFilterOptions> = signal({
    faculties: [],
    types: [],
    subtypes: [],
  });

  protected updateFilters(change: Partial<MajorFilterState>): void {
    this.majorFiltersState.update((state: MajorFilterState): {
      selectedFaculty: string;
      selectedType: string;
      selectedSubtype: string
    } => ({...state, ...change}));
  }

  ngOnInit(): void {
    const facultyMap$: Observable<Map<string, string>> = merge(of(undefined), this.facultyService.refreshNeeded).pipe(
      switchMap((): Observable<Map<string, string>> =>
        this.facultyService.getFaculties().pipe(
          map((faculties: FacultyElm[]): Map<string, string> => new Map(faculties.map((f: FacultyElm): [string, string] => [f.id, f.facultyName]))),
          catchError((): Observable<Map<string, string>> => of(this.facultyMap)),
        ),
      ),
    );

    const majors$: Observable<MajorElm[]> = merge(of(undefined), this.majorService.refreshNeeded).pipe(
      switchMap((): Observable<MajorElm[]> =>
        this.majorService.getMajors().pipe(
          catchError((): Observable<MajorElm[]> => of(this.majors)),
        ),
      ),
    );

    combineLatest([facultyMap$, majors$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([facultyMap, majors]: [Map<string, string>, MajorElm[]]): void => {
        this.facultyMap = facultyMap;
        this.majors = majors;
        const options: MajorFilterOptions = MajorTable.getFilterOptions(this.majors, this.facultyMap);
        const current: MajorFilterState = this.majorFiltersState();

        this.majorFiltersState.set({
          selectedFaculty: options.faculties.some((f: {
            id: string,
            name: string
          }): boolean => f.id === current.selectedFaculty)
            ? current.selectedFaculty : '',
          selectedType: options.types.includes(current.selectedType)
            ? current.selectedType : '',
          selectedSubtype: options.subtypes.includes(current.selectedSubtype)
            ? current.selectedSubtype : '',
        });

        this.majorFilterOptions.set({
          faculties: options.faculties,
          types: options.types,
          subtypes: options.subtypes,
        });
      });
  }
}
