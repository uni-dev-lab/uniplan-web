import { Component, ChangeDetectionStrategy, inject, OnInit, DestroyRef } from '@angular/core';
import { EditForm } from '../../../core/shared/edit-form/edit-form';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MajorService } from '../../major/major-service';
import { CourseService } from '../../course/course-service';
import { StudentService } from '../student-service';
import { MajorElm } from '../../../core/interfaces/major-elm';
import { CourseElm } from '../../../core/interfaces/course-elm';
import { StudentElm } from '../../../core/interfaces/student-elm';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-student-edit-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    EditForm,
    TranslatePipe,
  ],
  templateUrl: './student-edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-edit-form.scss',
})
export class StudentEditForm implements OnInit {
  private majorService = inject(MajorService);
  private courseService = inject(CourseService);
  private studentService = inject(StudentService);

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditForm>);
  private destroyRef = inject(DestroyRef);
  private isSubmitting = false;
  readonly data = inject<StudentElm>(MAT_DIALOG_DATA);

  studentForm!: FormGroup;
  majors: MajorElm[] = [];
  courses: CourseElm[] = [];
  uniqueSubtypes: string[] = [];
  uniqueTypes: string[] = [];
  uniqueYears: number[] = [];

  ngOnInit(): void {
    this.initForm();
    this.majorService.getMajors()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (majors) => {
          this.majors = majors;
          this.loadCoursesForMajor(this.data.majorId);
        },
        error: () => console.error('Failed to load majors')
      });
  }

  private initForm(): void {
    const nameParts = this.data.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    this.studentForm = this.formBuilder.nonNullable.group({
      firstName: [firstName, [Validators.required]],
      lastName: [lastName, [Validators.required]],
      facultyNumber: [this.data.facultyNumber, [Validators.required]],
      majorId: [this.data.majorId, [Validators.required]],
      courseSubtype: [{ value: this.data.courseSubtype, disabled: true }, [Validators.required]],
      courseType: [{ value: this.data.courseType, disabled: true }, [Validators.required]],
      courseYear: [{ value: this.data.courseYear, disabled: true }, [Validators.required]],
    });
  }

  private loadCoursesForMajor(majorId: string): void {
    this.courseService.getCoursesByMajorId(majorId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (courses) => {
          this.courses = courses;
          this.uniqueSubtypes = [...new Set(courses.map(c => c.courseSubtype))];
          this.studentForm.get('courseSubtype')?.enable();

          const subtype = this.data.courseSubtype;
          this.uniqueTypes = [...new Set(
            courses.filter(c => c.courseSubtype === subtype).map(c => c.courseType)
          )];
          this.studentForm.get('courseType')?.enable();

          const type = this.data.courseType;
          this.uniqueYears = [...new Set(
            courses.filter(c => c.courseSubtype === subtype && c.courseType === type).map(c => c.courseYear)
          )].sort((a, b) => a - b);
          this.studentForm.get('courseYear')?.enable();
        },
        error: () => console.error('Failed to load courses')
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

    this.courseService.getCoursesByMajorId(majorId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
      this.courses.filter(c => c.courseSubtype === subtype).map(c => c.courseType)
    )];
    this.studentForm.get('courseType')?.enable();
  }

  onTypeChange(type: string): void {
    this.uniqueYears = [];
    this.studentForm.get('courseYear')?.disable();
    this.studentForm.patchValue({ courseYear: '' });

    const subtype = this.studentForm.getRawValue().courseSubtype;
    this.uniqueYears = [...new Set(
      this.courses
        .filter(c => c.courseSubtype === subtype && c.courseType === type)
        .map(c => c.courseYear)
    )].sort((a, b) => a - b);
    this.studentForm.get('courseYear')?.enable();
  }

  private resolveCourseId(): string | null {
    const { courseSubtype, courseType, courseYear } = this.studentForm.getRawValue();
    const match = this.courses.find(
      c => c.courseSubtype === courseSubtype &&
        c.courseType === courseType &&
        c.courseYear === courseYear
    );
    return match?.id ?? null;
  }

  save(): void {
    if (this.studentForm.invalid || this.isSubmitting) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.studentForm.disable();

    const courseId = this.resolveCourseId();
    if (!courseId) {
      alert('Could not resolve course.');
      return;
    }

    const { firstName, lastName, facultyNumber } = this.studentForm.getRawValue();

    this.studentService
      .editStudent(this.data.id, { firstName, lastName, facultyNumber, courseId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting = false;
          this.studentForm.enable();
        })
      )
      .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: () => {
            alert('Failed to update student.');
          }
        });
  }
}