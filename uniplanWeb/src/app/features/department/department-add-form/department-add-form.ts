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
import { DepartmentService } from '../department-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { FacultyService } from '../../faculty/faculty-service';

@Component({
  selector: 'app-department-add-form',
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
  templateUrl: './department-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './department-add-form.scss',
})
export class DepartmentAddForm implements OnInit {
  departmentName = '';
  facultyId = '';

  faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddForm>,
    private departmentService: DepartmentService,
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
    if (!this.departmentName.trim() || !this.facultyId) {
      alert('Please fill all fields.');
      return;
    }

    this.departmentService
      .createDepartment({
        departmentName: this.departmentName,
        facultyId: this.facultyId,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => alert('Failed to create department.'),
      });
  }
}
