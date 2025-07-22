import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FacultyTable } from '../../../../features/faculty/faculty-table/faculty-table';
import { FacultyElm } from '../../../interfaces/faculty-elm';

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
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  displayedColumns: string[] = ['position', 'name', 'location', 'actions'];
  dataSource = ELEMENT_DATA;

  public ngAfterViewInit() {
    const componentRef = this.container.createComponent(FacultyTable);

    componentRef.instance.dataSource = this.dataSource;
    componentRef.instance.displayedColumns = this.displayedColumns;

    componentRef.instance.edit.subscribe((element: any) =>
      this.onEdit(element)
    );
    componentRef.instance.delete.subscribe((element: any) =>
      this.onDelete(element)
    );
  }

  onEdit(element: any): void {
    console.log('Editing:', element);
  }

  onDelete(element: any): void {
    console.log('Deleting:', element);
  }
}
