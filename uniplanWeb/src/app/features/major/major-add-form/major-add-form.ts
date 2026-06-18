import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MajorService } from '../major-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { FacultyService } from '../../faculty/faculty-service';


@Component({
  selector: 'app-major-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    AddForm,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './major-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-add-form.scss',
})
export class MajorAddForm implements OnInit {
  private formBuilder = inject(FormBuilder)

  majorForm!: FormGroup;

  faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddForm>,
    private majorService: MajorService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    this.initForm()

    this.facultyService.getFaculties().subscribe({
      next: (data) => {
        this.faculties = data;
      },
      error: (err) => console.error('Failed to load faculties', err),
    });
  }

  private initForm(): void {
    this.majorForm = this.formBuilder.nonNullable
    .group({
      majorName: ['', [Validators.required]],
      faculty: ['', [Validators.required]],
      type: ['', [Validators.required]],
      subtype: ['', [Validators.required]]
    });
  }

  save(): void {
    const { 
      majorName, faculty, type, subtype } = this.majorForm.value;

    if (
      !majorName.trim() ||
      !faculty ||
      !type ||
      !subtype
    ) {
      alert('Please fill all fields.');
      return;
    }

    this.majorService
      .createMajorWithCourse({
        facultyId: faculty,
        majorName: majorName,
        type: type,
        subtype: subtype,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => alert('Failed to create major or course.'),
      });
  }
}
