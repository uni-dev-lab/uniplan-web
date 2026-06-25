import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../student-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-student-delete-form',
  imports: [DeleteForm, MatDialogModule, TranslatePipe],
  templateUrl: './student-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-delete-form.scss',
})
export class StudentDeleteForm {
  private studentService = inject(StudentService);
  private dialogRef = inject(MatDialogRef<StudentDeleteForm>);
  private translate = inject(TranslateService);
  readonly data = inject<{ id: string; name: string, facultyNumber: string }>(MAT_DIALOG_DATA);

  delete(): void {
    this.studentService.deleteStudent(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        alert(this.translate.instant('student.delete.error'));
      },
    });
  }
}