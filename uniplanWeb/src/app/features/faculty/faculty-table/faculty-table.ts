import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { FacultyService } from '../faculty-service';

@Component({
  selector: 'app-faculty-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './faculty-table.html',
  styleUrl: './faculty-table.scss',
})
export class FacultyTable {
  displayedColumns: string[] = ['position', 'name', 'location', 'actions'];
  dataSource: FacultyElm[] = [];

  constructor(private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.loadFaculties();

    this.facultyService.refreshNeeded.subscribe(() => {
      this.loadFaculties();
    });
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((data) => {
      this.dataSource = data;
    });
  }

  onEdit(element: FacultyElm): void {
    console.log('Editing:', element);
  }

  onDelete(element: FacultyElm): void {
    console.log('Deleting:', element);
  }
}
