import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MajorAddForm } from '../major-add-form/major-add-form';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddButton } from '../../../core/shared/add-button/add-button';

@Component({
  selector: 'app-major-options',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    AddButton
],
  templateUrl: './major-options.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-options.scss',
})
export class MajorOptions {
  private dialog = inject(MatDialog);

  openAddForm() {
    this.dialog.open(MajorAddForm, {
      width: '400px',
    });
  }
}
