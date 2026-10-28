import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AddButton } from '../../../core/shared/add-button/add-button';
import { MatDialog } from '@angular/material/dialog';
import { StudentAddForm } from '../student-add-form/student-add-form';

@Component({
  selector: 'app-student-options',
  imports: [AddButton],
  templateUrl: './student-options.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-options.scss',
})
export class StudentOptions {
  private dialog = inject(MatDialog);

  protected openAddForm(): void {
    this.dialog.open(StudentAddForm, {
      width: '400px',
    });
  }
}
