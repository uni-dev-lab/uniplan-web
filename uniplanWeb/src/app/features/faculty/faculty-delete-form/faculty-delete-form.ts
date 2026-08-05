import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, } from '@angular/material/dialog';
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
  private facultyService = inject(FacultyService);
  private dialogRef = inject<MatDialogRef<FacultyDeleteForm>>(MatDialogRef);
  public data = inject<{ id: string; facultyName: string }>(MAT_DIALOG_DATA);

  protected deleteFaculty(): void {
    this.facultyService.deleteFaculty(this.data.id).subscribe({
      next: (): void => {
        this.dialogRef.close(true);
      },
      error: (): void => {
        alert('Възникна грешка при изтриването на факултета.');
      },
    });
  }
}
