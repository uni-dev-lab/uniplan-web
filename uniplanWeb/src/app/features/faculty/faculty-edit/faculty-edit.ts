import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatLabel } from '@angular/material/form-field';
import { FacultyService } from '../faculty-service';
import { EditForm } from '../../../core/shared/edit-form/edit-form';

@Component({
  selector: 'app-faculty-edit',
  templateUrl: './faculty-edit.html',
  styleUrl: './faculty-edit.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    EditForm,
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class FacultyEdit {

  private dialogRef = inject(MatDialogRef<EditForm>);
  private facultyService = inject(FacultyService);
  public data = inject<{
    id: string;
    facultyName: string;
    location: string;
    universityId: string;
  }>(MAT_DIALOG_DATA);

  facultyName = this.data.facultyName;
  location = this.data.location;
  universityId = this.data.universityId;

  save() {
    if (!this.facultyName.trim()) {
      alert('Please enter faculty name.');
      return;
    }

    if (!this.location.trim()) {
      alert('Please enter location.');
      return;
    }

    this.facultyService
      .editFaculty(this.data.id, {
        facultyName: this.facultyName,
        location: this.location,
        universityId: this.universityId,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          alert('Failed to update faculty.');
        },
      });
  }
}
