import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { EditForm } from '../../../core/shared/edit-form/edit-form';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MajorService } from '../major-service';
import { FacultyService } from '../../faculty/faculty-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-major-edit-form',
  templateUrl: './major-edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-edit-form.scss',
  imports: [
    EditForm,
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    TranslatePipe],
})
export class MajorEditForm implements OnInit {
  private dialogRef = inject<MatDialogRef<EditForm>>(MatDialogRef);
  private majorService = inject(MajorService);
  private facultyService = inject(FacultyService);
  public data = inject<{
    id: string;
    majorName: string;
    facultyId?: string;
  }>(MAT_DIALOG_DATA);

  majorName = '';
  facultyId = '';

  protected faculties: FacultyElm[] = [];

  constructor() {
    this.majorName = this.data.majorName;
    this.facultyId = this.data.facultyId || '';
  }

  public ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => (this.faculties = data),
      error: (err) => console.error('Failed to load faculties', err),
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
