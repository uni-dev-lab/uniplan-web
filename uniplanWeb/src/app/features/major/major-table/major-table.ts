import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MajorElm } from '../../../core/interfaces/major-elm';

export const ELEMENT_DATA: MajorElm[] = [
  {
    position: 1,
    name: 'Софтуерно инженерство',
    type: 'Бакалавър',
    subtype: 'Редовно',
    faculty: 'Факултет по математика и информатика (ФМИ)',
  },
  {
    position: 2,
    name: 'Философия',
    type: 'Бакалавър',
    subtype: 'Платено',
    faculty: 'Философско-исторически факултет',
  },
  {
    position: 3,
    name: 'Английска филология',
    type: 'Бакалавър',
    subtype: 'Редовно',
    faculty: 'Филологически факултет',
  },
  {
    position: 4,
    name: 'Биология',
    type: 'Бакалавър',
    subtype: 'Редовно',
    faculty: 'Биологически факултет',
  },
  {
    position: 5,
    name: 'Химия',
    type: 'Бакалавър',
    subtype: 'Платено',
    faculty: 'Химически факултет',
  },
  {
    position: 6,
    name: 'Физика',
    type: 'Бакалавър',
    subtype: 'Редовно',
    faculty: 'Физически факултет',
  },
  {
    position: 7,
    name: 'Педагогика',
    type: 'Бакалавър',
    subtype: 'Редовно',
    faculty: 'Педагогически факултет',
  },
  {
    position: 8,
    name: 'Математика и информатика',
    type: 'Магистър',
    subtype: 'Редовно',
    faculty: 'Факултет по математика и информатика (ФМИ)',
  },
  {
    position: 9,
    name: 'История',
    type: 'Магистър',
    subtype: 'Платено',
    faculty: 'Философско-исторически факултет',
  },
  {
    position: 10,
    name: 'Социология',
    type: 'Магистър',
    subtype: 'Редовно',
    faculty: 'Философско-исторически факултет',
  },
  {
    position: 11,
    name: 'Специална педагогика',
    type: 'Магистър',
    subtype: 'Редовно',
    faculty: 'Педагогически факултет',
  },
  {
    position: 12,
    name: 'Клинична психология',
    type: 'Магистър',
    subtype: 'Платено',
    faculty: 'Философско-исторически факултет',
  },
  {
    position: 13,
    name: 'Биотехнологии',
    type: 'Магистър',
    subtype: 'Редовно',
    faculty: 'Биологически факултет',
  },
  {
    position: 14,
    name: 'Екология и опазване на околната среда',
    type: 'Магистър',
    subtype: 'Редовно',
    faculty: 'Биологически факултет',
  },
  {
    position: 15,
    name: 'Приложна математика',
    type: 'Магистър',
    subtype: 'Платено',
    faculty: 'Факултет по математика и информатика (ФМИ)',
  },
];

@Component({
  selector: 'app-major-table',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  standalone: true,
  templateUrl: './major-table.html',
  styleUrl: './major-table.scss',
})
export class MajorTable implements OnChanges {
  displayedColumns: string[] = [
    'position',
    'name',
    'faculty',
    'type',
    'subtype',
    'actions',
  ];
  dataSource = ELEMENT_DATA;

  onEdit(element: MajorElm): void {
    console.log('Editing:', element);
  }

  onDelete(element: MajorElm): void {
    console.log('Deleting:', element);
  }

  @Input() searchText = '';

  @Input() faculty: string = '';
  @Input() type: string = '';
  @Input() subtype: string = '';

  @Input() faculties: string[] = [];
  @Input() types: string[] = [];
  @Input() subtypes: string[] = [];

  originalData: MajorElm[] = ELEMENT_DATA;
  dataSourceFilter: MajorElm[] = ELEMENT_DATA;

  ngOnChanges(changes: SimpleChanges): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.dataSourceFilter = this.originalData.filter((el) => {
      const matchesFaculty = !this.faculty || el.faculty === this.faculty;
      const matchesType = !this.type || el.type === this.type;
      const matchesSubtype = !this.subtype || el.subtype === this.subtype;
      const matchesSearch =
        !this.searchText ||
        el.name.toLowerCase().includes(this.searchText.toLowerCase());

      return matchesFaculty && matchesType && matchesSubtype && matchesSearch;
    });
  }
  static getFilterOptions(data: MajorElm[]) {
    return {
      faculties: [...new Set(data.map((e) => e.faculty))],
      types: [...new Set(data.map((e) => e.type))],
      subtypes: [...new Set(data.map((e) => e.subtype))],
    };
  }

  get filteredMajors(): MajorElm[] {
    return this.originalData.filter((major) => {
      const matchesFaculty = !this.faculty || major.faculty === this.faculty;
      const matchesType = !this.type || major.type === this.type;
      const matchesSubtype = !this.subtype || major.subtype === this.subtype;
      const matchesSearch =
        !this.searchText ||
        major.name.toLowerCase().includes(this.searchText.toLowerCase());

      return matchesFaculty && matchesType && matchesSubtype && matchesSearch;
    });
  }
}
