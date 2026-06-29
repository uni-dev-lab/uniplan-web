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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DepartmentService } from '../department-service';
import { FacultyService } from '../../faculty/faculty-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-department-edit-form',
  imports: [
    EditForm,
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
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
  protected readonly form: FormGroup<{
    departmentName: FormControl<string>;
    facultyId: FormControl<string>;
  }>;

  protected faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditForm>,
    private departmentService: DepartmentService,
    private facultyService: FacultyService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      departmentName: string;
      facultyId?: string;
    }
  ) {
    this.form = new FormGroup({
      departmentName: new FormControl(data.departmentName ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      facultyId: new FormControl(data.facultyId ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => (this.faculties = data),
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
      .editDepartment(this.data.id, {
        departmentName: departmentName.trim(),
        facultyId,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => alert(this.translate.instant('department.update-error')),
      });
  }
}
