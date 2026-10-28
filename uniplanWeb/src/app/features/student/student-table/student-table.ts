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

  @Input() public searchText: string = '';
  @Input() public searchFacNum: string = '';
  @Input() public searchMajor: string = '';
  @Input() public subtype: string = '';

  @Input() public subtypes: string[] = [];

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

 public ngOnInit(): void {
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

  public ngOnChanges(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const name: string = this.searchText.toLowerCase();
    const major: string = this.searchMajor.toLowerCase();
    const facNum: string = this.searchFacNum;

    this.dataSourceFilter = this.originalData.filter((student) => {
      const matchName:boolean = !name || student.name.toLowerCase().includes(name);
      const matchMajor:boolean = !major || student.majorName.toLowerCase().includes(major);
      const matchFacNum:boolean = !facNum || student.facultyNumber.includes(facNum);
      const matchSubtype:boolean = !this.subtype || student.courseSubtype === this.subtype;

      return matchName && matchMajor && matchFacNum && matchSubtype;
    });
  }

  public static getFilterOptions(data: StudentElm[]): StudentFilterOptions {
    return {
      subtypes: [...new Set(data.map((e) => e.courseSubtype))],
    };
  }

  protected onEdit(element: StudentElm): void {
    console.log('Editing:', element);
  }

  protected onDelete(element: StudentElm): void {
    console.log('Deleting:', element);
  }
}
