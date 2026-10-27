import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DeleteForm} from '../../../core/shared/delete-form/delete-form';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {LectorService} from '../lector-service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-lector-delete-form',
  templateUrl: './lector-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-delete-form.scss',
  imports: [DeleteForm, MatDialogModule, TranslatePipe],
})
export class LectorDeleteForm {
  private readonly lectorService: LectorService = inject(LectorService);
  private readonly dialogRef: MatDialogRef<LectorDeleteForm> = inject(MatDialogRef<LectorDeleteForm>);
  private readonly translate: TranslateService = inject(TranslateService);
  protected data: { id: string, firstName: string, lastName: string } = inject<{
    id: string;
    firstName: string;
    lastName: string
  }>(MAT_DIALOG_DATA);

  protected deleteLector(): void {
    this.lectorService
      .deleteLector(this.data.id)
      .subscribe({
        next: (): void => {
          this.dialogRef.close(true);
        },
        error: (): void => {
          alert(this.translate.instant('lector.delete-error'));
        },
      });
  }
}
