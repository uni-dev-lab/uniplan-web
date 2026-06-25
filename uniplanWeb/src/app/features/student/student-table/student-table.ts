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
import { TranslatePipe } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../student-service';
import { MatDialog } from '@angular/material/dialog';
import { StudentEditForm } from '../student-edit-form/student-edit-form';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-table.scss',
  imports: [MatTableModule, MatIconModule, MatButtonModule, TranslatePipe],
})
export class StudentTable implements OnInit, OnChanges {
  private dialog = inject(MatDialog)
  private studentService = inject(StudentService)
  //todo
  @Input() searchText = '';
  @Input() searchFacNum = '';
  @Input() searchMajor = '';
  @Input() subtype = '';

  @Input() subtypes: string[] = [];

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
    this.loadStudents();
    this.studentService.refreshNeeded.subscribe(() => {
      this.loadStudents();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyFilters();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.originalData = students;
        this.subtypes = StudentTable.getFilterOptions(students).subtypes;
        this.applyFilters();
      },
      error: () => {
        console.error('Failed to load students');
      }
    });
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

  static getFilterOptions(data: StudentElm[]) {
    return {
      subtypes: [...new Set(data.map((e) => e.courseSubtype))],
    };
  }

  onEdit(element: StudentElm): void {
    this.dialog.open(StudentEditForm, {
      data: element
    });
  }

  onDelete(element: StudentElm): void {
    console.log('Deleting:', element);
  }
}
