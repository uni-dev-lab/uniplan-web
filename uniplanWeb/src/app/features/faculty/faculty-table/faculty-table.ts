import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';

const ELEMENT_DATA: FacultyElm[] = [
  {
    position: 1,
    name: 'Факултет по математика и информатика (ФМИ)',
    location: 'бул. България №236А, Пловдив 4000',
  },
  {
    position: 2,
    name: 'Философско-исторически факултет',
    location: 'ул. Цар Асен 24, Пловдив 4000',
  },
  {
    position: 3,
    name: 'Филологически факултет',
    location: 'бул. Руски 236, Пловдив 4000',
  },
  {
    position: 4,
    name: 'Биологически факултет',
    location: 'ул. Тодор Самодумов 2, Пловдив 4000',
  },
  {
    position: 5,
    name: 'Химически факултет',
    location: 'ул. Цар Асен 24, Пловдив 4000',
  },
  {
    position: 6,
    name: 'Физически факултет',
    location: 'бул. България 236А, Пловдив 4000',
  },
  {
    position: 7,
    name: 'Педагогически факултет',
    location: 'ул. Любен Каравелов 1, Пловдив 4000',
  },
  {
    position: 8,
    name: 'Педагогически факултет',
    location: 'ул. Любен Каравелов 1, Пловдив 4000',
  },
  {
    position: 9,
    name: 'Педагогически факултет',
    location: 'ул. Любен Каравелов 1, Пловдив 4000',
  },
  {
    position: 10,
    name: 'Педагогически факултет',
    location: 'ул. Любен Каравелов 1, Пловдив 4000',
  },
  {
    position: 11,
    name: 'Педагогически факултет',
    location: 'ул. Любен Каравелов 1, Пловдив 4000',
  },
  {
    position: 12,
    name: 'Педагогически факултет',
    location: 'ул. Любен Каравелов 1, Пловдив 4000',
  },
  {
    position: 13,
    name: 'Биологически факултет',
    location: 'ул. Тодор Самодумов 2, Пловдив 4000',
  },
  {
    position: 14,
    name: 'Биологически факултет',
    location: 'ул. Тодор Самодумов 2, Пловдив 4000',
  },
  {
    position: 15,
    name: 'Биологически факултет',
    location: 'ул. Тодор Самодумов 2, Пловдив 4000',
  },
];

@Component({
  selector: 'app-faculty-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './faculty-table.html',
  styleUrl: './faculty-table.scss',
})
export class FacultyTable {
  displayedColumns: string[] = ['position', 'name', 'location', 'actions'];
  dataSource = ELEMENT_DATA;

  onEdit(element: FacultyElm): void {
    console.log('Editing:', element);
  }

  onDelete(element: FacultyElm): void {
    console.log('Deleting:', element);
  }
}
