import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { FacultyService } from '../faculty-service';
import {
  UniversityElm,
  UniversityService,
} from '../../university/university-service';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-faculty-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    AddForm,
    TranslatePipe,
  ],
  templateUrl: './faculty-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faculty-add-form.scss',
})
export class FacultyAddForm implements OnInit {
  private formBuilder = inject(FormBuilder);

  facultyForm!: FormGroup;

  universities: UniversityElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddForm>,
    private facultyService: FacultyService,
    private universityService: UniversityService
  ) { }

  ngOnInit(): void {
    this.initForm()

    this.universityService.getAllUniversities().subscribe({
      next: (data) => {
        this.universities = data;
      },
      error: (err) => {
        console.error('Failed to load universities', err);
      },
    });
  }

  private initForm() {
    this.facultyForm = this.formBuilder.nonNullable
    .group({
      facultyName: ['', [Validators.required]],
      location: ['', [Validators.required]],
      universityId: ['', [Validators.required]]
    });
  }

  save(): void {
    const {facultyName, location, universityId} = this.facultyForm.value;

    if (!facultyName.trim()) {
      alert('Please enter faculty name.');
      return;
    }

    if (!location.trim()) {
      alert('Please enter location.');
      return;
    }

    const newFaculty = {
      universityId: universityId,
      facultyName: facultyName,
      location: location,
    };

    this.facultyService.createFaculty(newFaculty).subscribe({
      next: (response) => {
        console.log('Faculty created:', response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Failed to add faculty', err);
        alert('Failed to add faculty.');
      },
    });
  }
}
