import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MajorService } from '../major-service';
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
  private majorService = inject(MajorService);
  private dialogRef = inject<MatDialogRef<MajorDeleteForm>>(MatDialogRef);
  public data = inject<{ id: string; name: string }>(MAT_DIALOG_DATA);

  protected deleteMajor(): void {
    this.majorService
      .deleteMajor(this.data.id)
      .subscribe({
        next: (): void => {
          this.dialogRef.close(true);
        },
        error: (): void => {
          alert('Възникна грешка при изтриването на специалността или курса.');
        },
      });
  }
}
