import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
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
  constructor(
    private lectorService: LectorService,
    private dialogRef: MatDialogRef<LectorDeleteForm>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; firstName: string; lastName: string }
  ) {}

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
