import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentService } from '../department-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { FacultyService } from '../../faculty/faculty-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-department-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    AddForm,
    MatFormFieldModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './department-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './department-add-form.scss',
})
export class DepartmentAddForm implements OnInit {
  protected readonly form = new FormGroup({
    departmentName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    facultyId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected faculties: FacultyElm[] = [];

  private dialogRef = inject(MatDialogRef<AddForm>);
  private departmentService = inject(DepartmentService);
  private facultyService = inject(FacultyService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => {
        this.faculties = data;
      },
      error: (err) => console.error('Failed to load faculties', err),
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { departmentName, facultyId } = this.form.getRawValue();

    this.departmentService
      .createDepartment({
        departmentName: departmentName.trim(),
        facultyId,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => alert(this.translate.instant('department.create-error')),
      });
  }
}
