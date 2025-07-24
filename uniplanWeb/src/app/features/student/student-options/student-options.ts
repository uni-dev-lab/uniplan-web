import { Component } from '@angular/core';
import { AddButton } from '../../../core/shared/add-button/add-button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-student-options',
  imports: [AddButton],
  templateUrl: './student-options.html',
  styleUrl: './student-options.scss',
})
export class StudentOptions {
  constructor(private dialog: MatDialog) {}

  openAddForm() {}
}
