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
import { DepartmentService } from '../department-service';
import { FacultyService } from '../../faculty/faculty-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-department-edit-form',
  imports: [
    EditForm,
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    TranslatePipe,
  ],
  templateUrl: './department-edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './department-edit-form.scss',
})
export class DepartmentEditForm implements OnInit {
  departmentName = '';
  facultyId = '';

  faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditForm>,
    private departmentService: DepartmentService,
    private facultyService: FacultyService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      departmentName: string;
      facultyId?: string;
    }
  ) {
    this.departmentName = data.departmentName;
    this.facultyId = data.facultyId || '';
  }

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => (this.faculties = data),
      error: (err) => console.error('Failed to load faculties', err),
    });
  }

  save() {
    if (!this.departmentName.trim()) {
      alert('Please enter the department name.');
      return;
    }

    this.departmentService
      .editDepartment(this.data.id, {
        departmentName: this.departmentName,
        facultyId: this.facultyId,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => alert('Failed to update department.'),
      });
  }
}
