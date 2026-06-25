import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MajorService } from '../../major/major-service';
import { CourseService } from '../../course/course-service';
import { StudentService } from '../student-service';
import { MajorElm } from '../../../core/interfaces/major-elm';
import { CourseElm } from '../../../core/interfaces/course-elm';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-student-add-form',
  templateUrl: './student-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-add-form.scss',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    AddForm,
    TranslatePipe
  ],
})
export class StudentAddForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private majorService = inject(MajorService);
  private courseService = inject(CourseService);
  private studentService = inject(StudentService);
  private dialogRef = inject(MatDialogRef<AddForm>);

  studentForm!: FormGroup;
  majors: MajorElm[] = [];
  courses: CourseElm[] = [];

  uniqueSubtypes: string[] = [];
  uniqueTypes: string[] = [];
  uniqueYears: number[] = [];

  ngOnInit(): void {
    this.initForm();
    this.majorService.getMajors().subscribe({
      next: (majors) => this.majors = majors,
      error: () => console.error('Failed to load majors')
    });
  }

  private initForm(): void {
    this.studentForm = this.formBuilder.nonNullable.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      facultyNumber: ['', [Validators.required]],
      majorId: ['', [Validators.required]],
      courseSubtype: [{ value: '', disabled: true }, [Validators.required]],
      courseType: [{ value: '', disabled: true }, [Validators.required]],
      courseYear: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  onMajorChange(majorId: string): void {
    this.courses = [];
    this.uniqueSubtypes = [];
    this.uniqueTypes = [];
    this.uniqueYears = [];
    this.studentForm.get('courseSubtype')?.disable();
    this.studentForm.get('courseType')?.disable();
    this.studentForm.get('courseYear')?.disable();
    this.studentForm.patchValue({ courseSubtype: '', courseType: '', courseYear: '' });

    this.courseService.getCoursesByMajorId(majorId).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.uniqueSubtypes = [...new Set(courses.map(c => c.courseSubtype))];
        this.studentForm.get('courseSubtype')?.enable();
      },
      error: () => console.error('Failed to load courses')
    });
  }

  onSubtypeChange(subtype: string): void {
    this.uniqueTypes = [];
    this.uniqueYears = [];
    this.studentForm.get('courseType')?.disable();
    this.studentForm.get('courseYear')?.disable();
    this.studentForm.patchValue({ courseType: '', courseYear: '' });

    this.uniqueTypes = [...new Set(
      this.courses
        .filter(c => c.courseSubtype === subtype)
        .map(c => c.courseType)
    )];
    this.studentForm.get('courseType')?.enable();
  }

  onTypeChange(type: string): void {
    this.uniqueYears = [];
    this.studentForm.get('courseYear')?.disable();
    this.studentForm.patchValue({ courseYear: '' });

    const subtype = this.studentForm.value.courseSubtype;
    this.uniqueYears = [...new Set(
      this.courses
        .filter(c => c.courseSubtype === subtype && c.courseType === type)
        .map(c => c.courseYear)
    )].sort((a, b) => a - b);
    this.studentForm.get('courseYear')?.enable();
  }

  private resolveCourseId(): string | null {
    const { courseSubtype, courseType, courseYear } = this.studentForm.value;
    const match = this.courses.find(
      c => c.courseSubtype === courseSubtype &&
        c.courseType === courseType &&
        c.courseYear === courseYear
    );
    return match?.id ?? null;
  }

  save(): void {
    if (this.studentForm.invalid) return;

    const courseId = this.resolveCourseId();
    if (!courseId) {
      alert('Could not resolve course.');
      return;
    }

    const { firstName, lastName, facultyNumber } = this.studentForm.value;

    this.studentService.createStudent({ firstName, lastName, facultyNumber, courseId }).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Failed to create student', err);
        alert('Failed to create student.');
      }
    });
  }
}