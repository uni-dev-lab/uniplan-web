import { Component, Inject, OnInit, ChangeDetectionStrategy, inject} from '@angular/core';
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
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MajorService } from '../major-service';
import { FacultyService } from '../../faculty/faculty-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';

@Component({
  selector: 'app-major-edit-form',
  imports: [
    EditForm,
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
],
  templateUrl: './major-edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-edit-form.scss',
})
export class MajorEditForm implements OnInit {
  private formBuilder = inject(FormBuilder)
  majorForm!: FormGroup;

  faculties: FacultyElm[] = [];

  public data = inject<{
    id: string;
    majorName: string;
    facultyId?: string;
  }>(MAT_DIALOG_DATA);

  constructor(
    private dialogRef: MatDialogRef<EditForm>,
    private majorService: MajorService,
    private facultyService: FacultyService,
  ) {}

  ngOnInit(): void {
    this.initForm()

    this.facultyService.getFaculties().subscribe({
      next: (data) => (
        this.faculties = data,
        this.majorForm.patchValue({
          majorName: this.data.majorName,
          facultyId: this.data.facultyId
        })
      ),
      error: (err) => console.error('Failed to load faculties', err),
    });
  }

  private initForm(): void{
    this.majorForm = this.formBuilder.nonNullable
    .group({
      majorName: ['', [Validators.required]],
      facultyId: ['', [Validators.required]]
    });
  }

  save(): void {
    const { majorName, facultyId} = this.majorForm.value;
    if (!majorName.trim()) {
      alert('Please enter the major name.');
      return;
    }

    this.majorService
      .editMajor(this.data.id, {
        majorName: majorName,
        facultyId: facultyId,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => alert('Failed to update major.'),
      });
  }
}
