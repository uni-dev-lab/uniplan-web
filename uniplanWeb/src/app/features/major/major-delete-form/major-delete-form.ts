import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MajorService } from '../major-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-major-delete-form',
  imports: [DeleteForm, MatDialogModule],
  templateUrl: './major-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-delete-form.scss',
})
export class MajorDeleteForm {

  private majorService = inject(MajorService);
  private dialogRef = inject(MatDialogRef<MajorDeleteForm>);
  public data = inject<{ id: string; courseId: string; name: string }>(MAT_DIALOG_DATA);

  deleteMajor(): void {
    this.majorService
      .deleteCourse(this.data.courseId)
      .pipe(switchMap(() => this.majorService.deleteMajor(this.data.id)))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          alert('Възникна грешка при изтриването на специалността или курса.');
        },
      });
  }
}
