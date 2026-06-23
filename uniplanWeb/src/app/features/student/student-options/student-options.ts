import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AddButton } from '../../../core/shared/add-button/add-button';
import { MatDialog } from '@angular/material/dialog';
import { StudentAddForm } from '../student-add-form/student-add-form';

@Component({
  selector: 'app-student-options',
  templateUrl: './student-options.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-options.scss',
  imports: [AddButton],
})
export class StudentOptions {
  constructor(private dialog: MatDialog) { }

  openAddForm() {
    this.dialog.open(StudentAddForm, {
      width: '400px',
    });
  }
}
