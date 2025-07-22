import { Component } from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-major-add-form',
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
  standalone: true,
  templateUrl: './major-add-form.html',
  styleUrl: './major-add-form.scss',
})
export class MajorAddForm {
  majorName = '';
  faculty = '';
  type = '';
  subtype = '';

  constructor(private dialogRef: MatDialogRef<AddForm>) {}

  save() {
    if (!this.majorName.trim()) {
      alert('Please enter major name.');
      return;
    }
    if (!this.faculty.trim()) {
      alert('Please enter faculty.');
      return;
    }
    if (!this.type.trim()) {
      alert('Please enter type.');
      return;
    }
    if (!this.subtype.trim()) {
      alert('Please enter subtype.');
      return;
    }

    console.log('Saving major:', this.majorName, this.type);

    this.dialogRef.close({
      name: this.majorName,
      location: this.type,
    });
  }
}
