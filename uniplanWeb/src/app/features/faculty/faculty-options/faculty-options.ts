import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FacultyAddForm } from '../faculty-add-form/faculty-add-form';
import { AddButton } from '../../../core/shared/add-button/add-button';

@Component({
  selector: 'app-faculty-options',
  templateUrl: './faculty-options.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faculty-options.scss',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    AddButton
  ],
})
export class FacultyOptions {
  private dialog = inject(MatDialog);

  openAddForm(): void {
    this.dialog.open(FacultyAddForm, {
      width: '400px',
      maxWidth: '90vw',
    });
  }
}
