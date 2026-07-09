import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../student-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-delete-form',
  imports: [DeleteForm, MatDialogModule, TranslatePipe],
  templateUrl: './student-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-delete-form.scss',
})
export class StudentDeleteForm {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(MatDialogRef<StudentDeleteForm>);
  private translate = inject(TranslateService);
  private isSubmitting = false;
  readonly data = inject<{ id: string; name: string, facultyNumber: string }>(MAT_DIALOG_DATA);

  delete(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.studentService
    .deleteStudent(this.data.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        alert(this.translate.instant('student.delete.error'));
      },
    });
  }
}