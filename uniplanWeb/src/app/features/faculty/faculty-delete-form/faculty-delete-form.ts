import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FacultyService } from '../faculty-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-faculty-delete-form',
  templateUrl: './faculty-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faculty-delete-form.scss',
  imports: [DeleteForm, MatDialogModule, TranslatePipe],
})
export class FacultyDeleteForm {
  constructor(
    private facultyService: FacultyService,
    private dialogRef: MatDialogRef<FacultyDeleteForm>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; facultyName: string }
  ) { }

  deleteFaculty(): void {
    this.facultyService.deleteFaculty(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        alert('Възникна грешка при изтриването на факултета.');
      },
    });
  }
}
