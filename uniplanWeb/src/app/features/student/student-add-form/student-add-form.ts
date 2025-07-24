import { Component } from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-student-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    AddForm,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './student-add-form.html',
  styleUrl: './student-add-form.scss',
})
export class StudentAddForm {
  studentName = '';

  constructor(private dialogRef: MatDialogRef<AddForm>) {}

  save() {
    if (!this.studentName.trim()) {
      alert('Please enter student name.');
      return;
    }

    console.log('Saving Student:', this.studentName);

    this.dialogRef.close({
      name: this.studentName,
    });
  }
}
