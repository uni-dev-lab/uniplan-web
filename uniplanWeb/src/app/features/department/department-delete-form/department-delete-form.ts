import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DepartmentService } from '../department-service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-department-delete-form',
  imports: [DeleteForm, MatDialogModule, TranslatePipe],
  templateUrl: './department-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './department-delete-form.scss',
})
export class DepartmentDeleteForm {
  constructor(
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DepartmentDeleteForm>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; departmentName: string }
  ) {}

  deleteDepartment(): void {
    this.departmentService
      .deleteDepartment(this.data.id)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          alert('Възникна грешка при изтриването на катедрата.');
        },
      });
  }
}
