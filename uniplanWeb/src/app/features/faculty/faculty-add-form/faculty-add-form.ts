import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { FacultyService } from '../faculty-service';
import { UniversityService } from '../../university/university-service'; // Make sure path is correct

@Component({
  selector: 'app-faculty-add-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    AddForm,
  ],
  templateUrl: './faculty-add-form.html',
  styleUrl: './faculty-add-form.scss',
})
export class FacultyAddForm {
  facultyName = '';
  location = '';
  universityId = '';

  constructor(
    private dialogRef: MatDialogRef<AddForm>,
    private facultyService: FacultyService
  ) {}

  save() {
    if (!this.facultyName.trim()) {
      alert('Please enter faculty name.');
      return;
    }

    if (!this.location.trim()) {
      alert('Please enter location.');
      return;
    }

    if (!this.universityId.trim()) {
      alert('Please select a university.');
      return;
    }

    const newFaculty = {
      universityId: this.universityId,
      facultyName: this.facultyName,
      location: this.location,
    };

    this.facultyService.createFaculty(newFaculty).subscribe({
      next: (response) => {
        console.log('Faculty created:', response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Failed to add faculty', err);
        alert('Failed to add faculty.');
      },
    });
  }
}
