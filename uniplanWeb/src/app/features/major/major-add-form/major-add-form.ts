import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MajorService } from '../major-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { FacultyService } from '../../faculty/faculty-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-major-add-form',
  templateUrl: './major-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-add-form.scss',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    AddForm,
    MatFormFieldModule,
    MatSelectModule,
    TranslatePipe,
  ],
})

export class MajorAddForm implements OnInit {
  majorName = '';
  faculty = '';
  type = '';
  subtype = '';

  protected faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddForm>,
    private majorService: MajorService,
    private facultyService: FacultyService
  ) {}

  public ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data: FacultyElm[]) => {
        this.faculties = data;
      },
      error: (err: any): void => console.error('Failed to load faculties', err),
    });
  }

  protected save(): void {
    if (
      !this.majorName.trim() ||
      !this.faculty ||
      !this.type ||
      !this.subtype
    ) {
      alert('Please fill all fields.');
      return;
    }

    this.majorService
      .createMajorWithCourse({
        facultyId: this.faculty,
        majorName: this.majorName,
        type: this.type,
        subtype: this.subtype,
      })
      .subscribe({
        next: (): void => {
          this.dialogRef.close(true);
        },
        error: (): void => alert('Failed to create major or course.'),
      });
  }
}
