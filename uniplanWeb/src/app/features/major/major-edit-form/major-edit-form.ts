import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
],
  templateUrl: './major-edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-edit-form.scss',
})
export class MajorEditForm implements OnInit {
  protected majorName: string = '';
  protected facultyId: string = '';

  protected faculties: FacultyElm[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditForm>,
    private majorService: MajorService,
    private facultyService: FacultyService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      majorName: string;
      facultyId?: string;
    }
  ) {
    this.majorName = data.majorName;
    this.facultyId = data.facultyId || '';
  }

  public ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data: FacultyElm[]): FacultyElm[] => (this.faculties = data),
      error: (err: any): void => console.error('Failed to load faculties', err),
    });
  }

  protected save(): void {
    if (!this.majorName.trim()) {
      alert('Please enter the major name.');
      return;
    }

    this.majorService
      .editMajor(this.data.id, {
        majorName: this.majorName,
        facultyId: this.facultyId,
      })
      .subscribe({
        next: (): void => this.dialogRef.close(true),
        error: (): void => alert('Failed to update major.'),
      });
  }
}
