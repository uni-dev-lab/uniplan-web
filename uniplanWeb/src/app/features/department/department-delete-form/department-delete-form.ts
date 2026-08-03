import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DeleteForm} from '../../../core/shared/delete-form/delete-form';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef,} from '@angular/material/dialog';
import {DepartmentService} from '../department-service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-department-delete-form',
  imports: [DeleteForm, MatDialogModule, TranslatePipe],
  templateUrl: './department-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './department-delete-form.scss',
})
export class DepartmentDeleteForm {
  private departmentService = inject(DepartmentService);
  private dialogRef = inject(MatDialogRef<DepartmentDeleteForm>);
  private translate = inject(TranslateService);
  data = inject<{ id: string; departmentName: string }>(MAT_DIALOG_DATA);

  protected deleteDepartment(): void {
    this.departmentService
      .deleteDepartment(this.data.id)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          alert(this.translate.instant('department.delete-error'));
        },
      });
  }
}
