import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { LectorService } from '../lector-service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-lector-delete-form',
  imports: [DeleteForm, MatDialogModule, TranslatePipe],
  templateUrl: './lector-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-delete-form.scss',
})
export class LectorDeleteForm {
  private lectorService = inject(LectorService);
  private dialogRef = inject(MatDialogRef<LectorDeleteForm>);
  private translate = inject(TranslateService);
  data = inject<{ id: string; firstName: string; lastName: string }>(MAT_DIALOG_DATA);

  protected deleteLector(): void {
    this.lectorService
      .deleteLector(this.data.id)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          alert(this.translate.instant('lector.delete-error'));
        },
      });
  }
}
