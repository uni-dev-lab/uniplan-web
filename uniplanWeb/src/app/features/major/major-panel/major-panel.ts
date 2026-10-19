import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
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
    this.majorFiltersState.update((state) => ({ ...state, ...change }));
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
        const current = this.majorFiltersState();

        this.majorFiltersState.set({
          selectedFaculty: options.faculties.some((f) => f.id === current.selectedFaculty)
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
