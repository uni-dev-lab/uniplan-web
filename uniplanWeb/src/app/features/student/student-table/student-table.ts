import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { StudentElm } from '../../../core/interfaces/student-elm';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {StudentEditForm} from '../student-edit-form/student-edit-form';

export const ELEMENT_STUDENT_DATA: StudentElm[] = [
  {
    position: 1,
    name: 'Иван Иванов',
    facultyNumber: '123456',
    majorType: 'бакалавър',
    major: 'Компютърни науки',
    course: '3',
    subtype: 'редовно',
  },
  {
    position: 2,
    name: 'Мария Петрова',
    facultyNumber: '234567',
    majorType: 'бакалавър',
    major: 'История',
    course: '2',
    subtype: 'задочно',
  },
  {
    position: 3,
    name: 'Георги Георгиев',
    facultyNumber: '345678',
    majorType: 'бакалавър',
    major: 'Английска филология',
    course: '1',
    subtype: 'редовно',
  },
  {
    position: 4,
    name: 'Анна Димитрова',
    facultyNumber: '456789',
    majorType: 'магистър',
    major: 'Молекулярна биология',
    course: '4',
    subtype: 'редовно',
  },
  {
    position: 5,
    name: 'Петър Петров',
    facultyNumber: '567890',
    majorType: 'магистър',
    major: 'Органична химия',
    course: '2',
    subtype: 'редовно',
  },
  {
    position: 6,
    name: 'Елена Стоянова',
    facultyNumber: '678901',
    majorType: 'магистър',
    major: 'Астрофизика',
    course: '3',
    subtype: 'задочно',
  },
  {
    position: 7,
    name: 'Димитър Иванов',
    facultyNumber: '789012',
    majorType: 'бакалавър',
    major: 'Начална педагогика',
    course: '1',
    subtype: 'редовно',
  },
  {
    position: 8,
    name: 'Виктория Николова',
    facultyNumber: '890123',
    majorType: 'бакалавър',
    major: 'Специална педагогика',
    course: '4',
    subtype: 'редовно',
  },
  {
    position: 9,
    name: 'Красимир Тодоров',
    facultyNumber: '901234',
    majorType: 'бакалавър',
    major: 'Екология',
    course: '3',
    subtype: 'задочно',
  },
  {
    position: 10,
    name: 'Милена Георгиева',
    facultyNumber: '012345',
    majorType: 'магистър',
    major: 'Прикладна математика',
    course: '2',
    subtype: 'редовно',
  },
];

@Component({
  selector: 'app-student-table',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './student-table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-table.scss',
})
export class StudentTable implements OnInit, OnChanges {
  private readonly dialog: MatDialog = inject(MatDialog);

  @Input() public searchText: string = '';
  @Input() public searchFacNum: string = '';
  @Input() public searchMajor: string = '';
  @Input() public subtype: string = '';

  @Input() public subtypes: string[] = [];

  protected displayedColumns: string[] = [
    'position',
    'name',
    'facultyNumber',
    'major',
    'majorType',
    'subtype',
    'course',
    'actions',
  ];

  protected originalData: StudentElm[] = ELEMENT_STUDENT_DATA;
  protected dataSourceFilter: StudentElm[] = ELEMENT_STUDENT_DATA;

  public ngOnInit(): void {
    this.subtypes = StudentTable.getFilterOptions(this.originalData).subtypes;
    this.applyFilters();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const name: string = this.searchText.toLowerCase();
    const major: string = this.searchMajor.toLowerCase();
    const facNum: string = this.searchFacNum;

    this.dataSourceFilter = this.originalData.filter((student) => {
      const matchName: boolean = !name || student.name.toLowerCase().includes(name);
      const matchMajor: boolean = !major || student.major.toLowerCase().includes(major);
      const matchFacNum: boolean = !facNum || student.facultyNumber.includes(facNum);
      const matchSubtype: boolean = !this.subtype || student.subtype === this.subtype;

      return matchName && matchMajor && matchFacNum && matchSubtype;
    });
  }

  public static getFilterOptions(data: StudentElm[]) {
    return {
      subtypes: [...new Set(data.map((e: StudentElm) => e.subtype))],
    };
  }

  protected onEdit(element: StudentElm): void {
    const dialogRef = this.dialog.open(StudentEditForm, {
      width: '500px',
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe((updatedStudent: StudentElm | undefined): void => {
      if (!updatedStudent) {
        return;
      }

      this.originalData = this.originalData.map((student: StudentElm): StudentElm =>
        student.position === element.position ? updatedStudent : student
      );

      this.applyFilters();
    });
  }

  protected onDelete(element: StudentElm): void {
    console.log('Deleting:', element);
  }
}
