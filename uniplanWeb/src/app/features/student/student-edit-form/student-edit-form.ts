import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { EditForm } from '../../../core/shared/edit-form/edit-form';
import { StudentElm } from '../../../core/interfaces/student-elm';

@Component({
  selector: 'app-student-edit-form',
  standalone: true,
  imports: [
    EditForm,
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './student-edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-edit-form.scss',
})
export class StudentEditForm {
  protected name: string = '';
  protected facultyNumber: string = '';
  protected major: string = '';
  protected majorType: StudentElm['majorType'] = 'бакалавър';
  protected course: string = '';
  protected subtype: StudentElm['subtype'] = 'редовно';

  public constructor(
    private readonly dialogRef: MatDialogRef<StudentEditForm>,
    @Inject(MAT_DIALOG_DATA) protected readonly data: StudentElm
  ) {
    this.name = data.name;
    this.facultyNumber = data.facultyNumber;
    this.major = data.major;
    this.majorType = data.majorType;
    this.course = data.course;
    this.subtype = data.subtype;
  }

  protected save(): void {
    if (!this.name.trim()) {
      alert('Моля въведете име на студента.');
      return;
    }

    if (!this.facultyNumber.trim()) {
      alert('Моля въведете факултетен номер.');
      return;
    }

    if (!this.major.trim()) {
      alert('Моля въведете специалност.');
      return;
    }

    if (!this.course.trim()) {
      alert('Моля въведете курс.');
      return;
    }

    const updatedStudent: StudentElm = {
      ...this.data,
      name: this.name,
      facultyNumber: this.facultyNumber,
      major: this.major,
      majorType: this.majorType,
      course: this.course,
      subtype: this.subtype,
    };

    this.dialogRef.close(updatedStudent);
  }
}
