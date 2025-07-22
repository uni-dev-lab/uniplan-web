import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddForm } from '../../../core/shared/add-form/add-form';

@Component({
  selector: 'app-faculty-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    AddForm,
  ],
  standalone: true,
  templateUrl: './faculty-add-form.html',
  styleUrl: './faculty-add-form.scss',
})
export class FacultyAddForm {
  facultyName = '';
  location = '';

  constructor(private dialogRef: MatDialogRef<AddForm>) {}

  save() {
    if (!this.facultyName.trim()) {
      alert('Please enter a faculty name.');
      return;
    }
    if (!this.location.trim()) {
      alert('Please enter a location.');
      return;
    }

    console.log('Saving faculty:', this.facultyName, this.location);

    this.dialogRef.close({
      name: this.facultyName,
      location: this.location,
    });
  }
}
