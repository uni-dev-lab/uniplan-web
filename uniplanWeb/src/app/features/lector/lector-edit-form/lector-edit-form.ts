import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EditForm } from '../../../core/shared/edit-form/edit-form';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LectorService } from '../lector-service';
import { FacultyService } from '../../faculty/faculty-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lector-edit-form',
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
  templateUrl: './lector-edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-edit-form.scss',
})
export class LectorEditForm implements OnInit {
  protected readonly form: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    facultyId: FormControl<string>;
  }>;

  protected faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditForm>,
    private lectorService: LectorService,
    private facultyService: FacultyService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      facultyId?: string;
    }
  ) {
    this.form = new FormGroup({
      firstName: new FormControl(data.firstName ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl(data.lastName ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl(data.email ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
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

    const { firstName, lastName, email, facultyId } = this.form.getRawValue();

    this.lectorService
      .editLector(this.data.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        facultyId,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => alert(this.translate.instant('lector.update-error')),
      });
  }
}
