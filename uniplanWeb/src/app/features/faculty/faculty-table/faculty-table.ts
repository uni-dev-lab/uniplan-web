import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-faculty-table',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  standalone: true,
  templateUrl: './faculty-table.html',
  styleUrl: './faculty-table.scss',
})
export class FacultyTable {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onEdit(element: any): void {
    this.edit.emit(element);
  }

  onDelete(element: any): void {
    this.delete.emit(element);
  }
}
