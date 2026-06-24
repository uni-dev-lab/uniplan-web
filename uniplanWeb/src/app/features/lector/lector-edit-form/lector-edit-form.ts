import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EditForm } from '../../../core/shared/edit-form/edit-form';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LectorService } from '../lector-service';
import { FacultyService } from '../../faculty/faculty-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';

@Component({
  selector: 'app-lector-edit-form',
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
  templateUrl: './lector-edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-edit-form.scss',
})
export class LectorEditForm implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  facultyId = '';

  faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditForm>,
    private lectorService: LectorService,
    private facultyService: FacultyService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      facultyId?: string;
    }
  ) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.facultyId = data.facultyId || '';
  }

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => (this.faculties = data),
      error: (err) => console.error('Failed to load faculties', err),
    });
  }

  save() {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim()) {
      alert('Please fill all fields.');
      return;
    }

    this.lectorService
      .editLector(this.data.id, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        facultyId: this.facultyId,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => alert('Failed to update lector.'),
      });
  }
}
