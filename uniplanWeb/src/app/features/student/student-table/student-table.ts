import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  output,
  DestroyRef
} from '@angular/core';
import { StudentElm } from '../../../core/interfaces/student-elm';
import { StudentFilterOptions } from '../../../core/interfaces/student-filter-options';
import { TranslatePipe } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../student-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  merge,
  Observable,
  of,
  switchMap
} from 'rxjs';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-table.scss',
  imports: [MatTableModule, MatIconModule, MatButtonModule, TranslatePipe],
})
export class StudentTable implements OnInit, OnChanges {
  private readonly studentService = inject(StudentService)
  private readonly destroyRef = inject(DestroyRef);
  @Input() searchText = '';
  @Input() searchFacNum = '';
  @Input() searchMajor = '';
  @Input() subtype = '';

  @Input() subtypes: string[] = [];

  subtypesLoaded = output<string[]>();

  displayedColumns: string[] = [
    'position',
    'name',
    'facultyNumber',
    'majorName',
    'courseSubtype',
    'courseType',
    'courseYear',
    'actions',
];

  originalData: StudentElm[] = [];
  dataSourceFilter: StudentElm[] = [];

  ngOnInit(): void {
    const students$: Observable<StudentElm[]> = merge(of(undefined), this.studentService.refreshNeeded).pipe(
      switchMap((): Observable<StudentElm[]> =>
        this.studentService.getStudents().pipe(
          catchError((): Observable<StudentElm[]> => of(this.originalData)),
        ),
      ),
    );

    students$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((students: StudentElm[]) => {
      this.originalData = students;
      this.subtypes = StudentTable.getFilterOptions(students).subtypes;
      this.subtypesLoaded.emit(this.subtypes);
      this.applyFilters();
    });
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const name = this.searchText.toLowerCase();
    const major = this.searchMajor.toLowerCase();
    const facNum = this.searchFacNum;

    this.dataSourceFilter = this.originalData.filter((student) => {
      const matchName = !name || student.name.toLowerCase().includes(name);
      const matchMajor = !major || student.majorName.toLowerCase().includes(major);
      const matchFacNum = !facNum || student.facultyNumber.includes(facNum);
      const matchSubtype = !this.subtype || student.courseSubtype === this.subtype;

      return matchName && matchMajor && matchFacNum && matchSubtype;
    });
  }

  static getFilterOptions(data: StudentElm[]): StudentFilterOptions {
    return {
      subtypes: [...new Set(data.map((e) => e.courseSubtype))],
    };
  }

  onEdit(element: StudentElm): void {
    console.log('Editing:', element);
  }

  onDelete(element: StudentElm): void {
    console.log('Deleting:', element);
  }
}
