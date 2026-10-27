import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {LectorOptions} from '../lector-options/lector-options';
import {LectorFilters} from '../lector-filters/lector-filters';
import {LectorTable} from '../lector-table/lector-table';
import {LectorService} from '../lector-service';
import {FacultyService} from '../../faculty/faculty-service';
import {FacultyElm} from '../../../core/interfaces/faculty-elm';
import {LectorFilterState} from '../../../core/interfaces/lector-filter-state';

@Component({
  selector: 'app-lector-panel',
  templateUrl: './lector-panel.html',
  styleUrl: './lector-panel.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LectorOptions, LectorFilters, LectorTable],
})
export class LectorPanel implements OnInit {

  private readonly lectorService: LectorService = inject(LectorService);
  private readonly facultyService: FacultyService = inject(FacultyService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public lectorFiltersState: WritableSignal<LectorFilterState> = signal({
    searchText: '',
    faculties: [],
    selectedFaculty: '',
  });

  public ngOnInit(): void {
    this.loadLectorFilters();
    this.lectorService.refreshNeeded
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((): void => this.loadLectorFilters());
  }

  private loadLectorFilters(): void {
    this.facultyService
      .getFaculties()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((faculties: FacultyElm[]): void => {
        this.lectorFiltersState.update((state: LectorFilterState): LectorFilterState => ({
          ...state,
          faculties: faculties.map((f: FacultyElm): { id: string, name: string } => ({
            id: f.id,
            name: f.facultyName,
          }))
        }));
      });
  }

  protected updateFilters(change: Partial<LectorFilterState>): void {
    this.lectorFiltersState.update((state: LectorFilterState): {
      searchText: string;
      faculties: { id: string; name: string }[];
      selectedFaculty: string;
    } => ({...state, ...change}));
  }

}
