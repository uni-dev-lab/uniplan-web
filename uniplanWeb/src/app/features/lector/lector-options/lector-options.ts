import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LectorAddForm } from '../lector-add-form/lector-add-form';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddButton } from '../../../core/shared/add-button/add-button';

@Component({
  selector: 'app-lector-options',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    AddButton,
  ],
  templateUrl: './lector-options.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-options.scss',
})
export class LectorOptions {
  constructor(private dialog: MatDialog) {}

  openAddForm() {
    this.dialog.open(LectorAddForm, {
      width: '400px',
    });
  }
}
