import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    AddForm,
  ],
  templateUrl: './student-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-add-form.scss',
})
export class StudentAddForm implements OnInit {
  private formBuilder = inject(FormBuilder)

  studentForm!: FormGroup

  constructor(private dialogRef: MatDialogRef<AddForm>) { }
  
  ngOnInit(): void {
    this.initForm()
  }

  private initForm(): void{
    this.studentForm = this.formBuilder.nonNullable
    .group({
      studentName: ['', [Validators.required]],
      facultyNumber: ['', [Validators.required]],
      faculty: ['', [Validators.required]],
      major: ['', [Validators.required]],
      course: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  save(): void {
    const {
      studentName,
      facultyNumber,
      faculty,
      major,
      course,
      type
    } = this.studentForm.value

    if (!studentName.trim()) {
      alert('Please enter student name.');
      return;
    }
    if (!facultyNumber.trim()) {
      alert('Please enter faculty numbe.');
      return;
    }
    if (!faculty.trim()) {
      alert('Please enter faculty.');
      return;
    }
    if (!major.trim()) {
      alert('Please enter major.');
      return;
    }
    if (!course.trim()) {
      alert('Please enter course.');
      return;
    }
    if (!type.trim()) {
      alert('Please enter type.');
      return;
    }

    console.log(
      'Saving Student:',
      studentName,
      facultyNumber,
      faculty,
      major,
      course,
      type
    );

    this.dialogRef.close({
      name,
      facultyNumber,
      faculty,
      major,
      course,
      type
    });
  }
}
