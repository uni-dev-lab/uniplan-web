
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FacultyAddForm } from '../faculty-add-form/faculty-add-form';
import { AddButton } from '../../../core/shared/add-button/add-button';

@Component({
  selector: 'app-faculty-options',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    AddButton
],
  templateUrl: './faculty-options.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faculty-options.scss',
})
export class FacultyOptions {
  constructor(private dialog: MatDialog) {}

  openAddForm(): void {
    this.dialog.open(FacultyAddForm, {
      width: '400px',
    });
  }
}
