import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { LectorService } from '../lector-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { FacultyService } from '../../faculty/faculty-service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-lector-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    AddForm,
    MatFormFieldModule,
    MatSelectModule,
    AddForm,
    TranslatePipe,
  ],
  templateUrl: './lector-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-add-form.scss',
})
export class LectorAddForm implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  facultyId = '';

  faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddForm>,
    private lectorService: LectorService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => {
        this.faculties = data;
      },
      error: (err) => console.error('Failed to load faculties', err),
    });
  }

  save() {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim() || !this.facultyId) {
      alert('Please fill all fields.');
      return;
    }

    this.lectorService
      .createLector({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        facultyId: this.facultyId,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => alert('Failed to create lector.'),
      });
  }
}
