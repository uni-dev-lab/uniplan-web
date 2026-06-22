import { Component, ChangeDetectionStrategy, OnInit, inject} from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MajorElm } from '../../../core/interfaces/major-elm';
import { MajorService } from '../../major/major-service';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';

@Component({
  selector: 'app-student-add-form',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    AddForm,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './student-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-add-form.scss',
})
export class StudentAddForm implements OnInit {
  protected studentName: string = '';
  protected facultyNumber: string = '';
  protected faculty: string = '';
  protected major: string = '';
  protected course: string = '';
  protected type: string = '';

  protected majors: MajorElm[] = [];
  protected courses: string[] = ['1', '2', '3', '4'];
  protected types: string[] = [];

  private readonly dialogRef: MatDialogRef<StudentAddForm> =
    inject(MatDialogRef<StudentAddForm>);

  private readonly majorService: MajorService = inject(MajorService);

  public ngOnInit(): void {
    this.majorService.getMajors().subscribe({
      next: (majors: MajorElm[]): void => {
        this.majors = majors;
        this.types = [
          ...new Set(
            majors
              .map((major: MajorElm): string => major.courseType)
              .filter((type: string): boolean => !!type)
          ),
        ];
      },
      error: (err: unknown): void => {
        console.error('Failed to load majors', err);
      },
    });
  }

  protected save(): void {
    if (!this.studentName.trim()) {
      alert('Please enter student name.');
      return;
    }
    if (!this.facultyNumber.trim()) {
      alert('Please enter faculty number.');
      return;
    }
    if (!this.faculty.trim()) {
      alert('Please enter faculty.');
      return;
    }
    if (!this.major.trim()) {
      alert('Please enter major.');
      return;
    }
    if (!this.course.trim()) {
      alert('Please enter course.');
      return;
    }
    if (!this.type.trim()) {
      alert('Please enter type.');
      return;
    }

    console.log(
      'Saving Student:',
      this.studentName,
      this.facultyNumber,
      this.faculty,
      this.major,
      this.course,
      this.type
    );

    this.dialogRef.close({
      name: this.studentName,
      facultyNumber: this.facultyNumber,
      faculty: this.faculty,
      major: this.major,
      course: this.course,
      type: this.type,
    });
  }

  protected onMajorChange(value: string): void {
    this.major = value;
  }

  protected onCourseChange(value: string): void {
    this.course = value;
  }

  protected onTypeChange(value: string): void {
    this.type = value;
  }
}
