import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
  ],
  standalone: true,
  templateUrl: './add-form.html',
  styleUrl: './add-form.scss',
})
export class AddForm {
  facultyName: string = '';
  location: string = '';

  constructor(private dialogRef: MatDialogRef<AddForm>) {}

  save() {
    if (!this.facultyName || this.facultyName.trim() === '') {
      alert('Please enter a faculty name.');
      return;
    }
    if (!this.location || this.location.trim() === '') {
      alert('Please enter a location.');
      return;
    }

    this.dialogRef.close({
      name: this.facultyName,
      location: this.location,
    });

    console.log('Faculty name: ', this.facultyName);
    console.log('Location: ', this.location);
  }
}
