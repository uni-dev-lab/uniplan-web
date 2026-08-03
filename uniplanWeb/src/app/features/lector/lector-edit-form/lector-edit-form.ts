import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
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
  private dialogRef = inject(MatDialogRef<EditForm>);
  private lectorService = inject(LectorService);
  private facultyService = inject(FacultyService);
  private translate = inject(TranslateService);
  data = inject<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    facultyId?: string;
  }>(MAT_DIALOG_DATA);

  protected faculties: FacultyElm[] = [];

  protected readonly form = new FormGroup({
    firstName: new FormControl(this.data.firstName ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl(this.data.lastName ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl(this.data.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    facultyId: new FormControl(this.data.facultyId ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

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
