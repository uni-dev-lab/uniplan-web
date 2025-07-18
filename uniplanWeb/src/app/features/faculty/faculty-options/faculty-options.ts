import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AddForm } from '../add-form/add-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-faculty-options',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    AddForm,
  ],
  standalone: true,
  templateUrl: './faculty-options.html',
  styleUrl: './faculty-options.scss',
})
export class FacultyOptions {
  constructor(private dialog: MatDialog) {}

  openAddForm() {
    this.dialog.open(AddForm, {
      width: '400px',
    });
  }
}
