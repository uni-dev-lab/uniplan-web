import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {AddForm} from '../../../core/shared/add-form/add-form';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatFormFieldModule, MatLabel,} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {LectorService} from '../lector-service';
import {FacultyElm} from '../../../core/interfaces/faculty-elm';
import {FacultyService} from '../../faculty/faculty-service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-lector-add-form',
  templateUrl: './lector-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-add-form.scss',
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
})
export class LectorAddForm implements OnInit {
  protected readonly form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    facultyId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected faculties: FacultyElm[] = [];

  private readonly dialogRef: MatDialogRef<AddForm> = inject(MatDialogRef<AddForm>);
  private readonly lectorService: LectorService = inject(LectorService);
  private readonly facultyService: FacultyService = inject(FacultyService);
  private readonly translate: TranslateService = inject(TranslateService);

  public ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data: FacultyElm[]): void => {
        this.faculties = data;
      },
      error: (err: Error): void => console.error('Failed to load faculties', err),
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, facultyId } = this.form.getRawValue();

    this.lectorService
      .createLector({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        facultyId,
      })
      .subscribe({
        next: (): void => {
          this.dialogRef.close(true);
        },
        error: (): void => alert(this.translate.instant('lector.create-error')),
      });
  }
}
