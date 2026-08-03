import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LectorOptions } from '../lector-options/lector-options';
import { LectorFilters } from '../lector-filters/lector-filters';
import { LectorTable } from '../lector-table/lector-table';
import { LectorService } from '../lector-service';
import { FacultyService } from '../../faculty/faculty-service';

@Component({
  selector: 'app-lector-panel',
  imports: [LectorOptions, LectorFilters, LectorTable],
  templateUrl: './lector-panel.html',
  styleUrl: './lector-panel.scss',
})
export class LectorPanel implements OnInit {
  lectorSearchText = '';
  selectedLectorFaculty = '';
  lectorFaculties: { id: string; name: string }[] = [];

  private lectorService = inject(LectorService);
  private facultyService = inject(FacultyService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadLectorFilters();

    this.lectorService.refreshNeeded
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadLectorFilters());
  }

  private loadLectorFilters(): void {
    this.facultyService
      .getFaculties()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((faculties) => {
        this.lectorFaculties = faculties.map((f) => ({
          id: f.id,
          name: f.facultyName,
        }));
      });
  }
}
