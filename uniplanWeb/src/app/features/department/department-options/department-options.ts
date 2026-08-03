import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentAddForm } from '../department-add-form/department-add-form';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddButton } from '../../../core/shared/add-button/add-button';

@Component({
  selector: 'app-department-options',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    AddButton,
  ],
  templateUrl: './department-options.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './department-options.scss',
})
export class DepartmentOptions {
  private dialog = inject(MatDialog);

  protected openAddForm(): void {
    this.dialog.open(DepartmentAddForm, {
      width: '400px',
    });
  }
}
