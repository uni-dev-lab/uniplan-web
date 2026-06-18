import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MajorService } from '../major-service';
import { switchMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-major-delete-form',
  templateUrl: './major-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-delete-form.scss',
  imports: [DeleteForm, MatDialogModule,
    TranslatePipe],
})
export class MajorDeleteForm {
  constructor(
    private majorService: MajorService,
    private dialogRef: MatDialogRef<MajorDeleteForm>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; courseId: string; name: string }
  ) { }

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
