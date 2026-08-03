import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, map, merge, of, switchMap } from 'rxjs';

import { DepartmentElm } from '../../../core/interfaces/department-elm';
import { FacultyService } from '../../faculty/faculty-service';
import { DepartmentOptions } from '../department-options/department-options';
import { DepartmentFilters } from '../department-filters/department-filters';
import { DepartmentTable } from '../department-table/department-table';
import { DepartmentService } from '../department-service';

@Component({
  selector: 'app-department-panel',
  imports: [DepartmentOptions, DepartmentFilters, DepartmentTable],
  templateUrl: './department-panel.html',
  styleUrl: './department-panel.scss',
})
export class DepartmentPanel implements OnInit {
  searchText: string = '';
  selectedFaculty: string = '';

  faculties: { id: string; name: string }[] = [];

  private departments: DepartmentElm[] = [];
  private facultyMap: Map<string, string> = new Map<string, string>();
  private destroyRef = inject(DestroyRef);
  private departmentService = inject(DepartmentService);
  private facultyService = inject(FacultyService);

  ngOnInit(): void {
    const facultyMap$ = merge(of(undefined), this.facultyService.refreshNeeded).pipe(
      switchMap(() =>
        this.facultyService.getFaculties().pipe(
          map((faculties) => new Map(faculties.map((f) => [f.id, f.facultyName]))),
          catchError(() => of(this.facultyMap)),
        ),
      ),
    );

    const departments$ = merge(of(undefined), this.departmentService.refreshNeeded).pipe(
      switchMap(() =>
        this.departmentService.getDepartments().pipe(
          catchError(() => of(this.departments)),
        ),
      ),
    );

    combineLatest([facultyMap$, departments$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([facultyMap, departments]) => {
        this.facultyMap = facultyMap;
        this.departments = departments;

        const options = DepartmentTable.getFilterOptions(this.departments, this.facultyMap);
        this.faculties = options.faculties;

        if (this.selectedFaculty && !this.faculties.some((f) => f.id === this.selectedFaculty)) {
          this.selectedFaculty = '';
        }
      });
  }
}
