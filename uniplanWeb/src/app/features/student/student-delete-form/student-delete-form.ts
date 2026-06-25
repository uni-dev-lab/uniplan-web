import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../student-service';

@Component({
  selector: 'app-student-delete-form',
  imports: [DeleteForm, MatDialogModule],
  templateUrl: './student-delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-delete-form.scss',
})
export class StudentDeleteForm {
  private studentService = inject(StudentService);
  private dialogRef = inject(MatDialogRef<StudentDeleteForm>);
  readonly data = inject<{ id: string; name: string, facultyNumber: string }>(MAT_DIALOG_DATA);

  delete(): void {
    this.studentService.deleteStudent(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        alert('Възникна грешка при изтриването на студента.');
      },
    });
  }
}