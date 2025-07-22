import { Component } from '@angular/core';
import { Table } from './table/table';
import { FacultyOptions } from '../../../features/faculty/faculty-options/faculty-options';
import { ViewService } from './view.service';
import { CommonModule } from '@angular/common';
import { MajorOptions } from '../../../features/major/major-options/major-options';
import { FacultyTable } from '../../../features/faculty/faculty-table/faculty-table';
import { MajorTable } from '../../../features/major/major-table/major-table';

@Component({
  selector: 'app-main-panel',
  imports: [
    CommonModule,
    Table,
    FacultyOptions,
    MajorOptions,
    FacultyTable,
    MajorTable,
  ],
  standalone: true,
  templateUrl: './main-panel.html',
  styleUrl: './main-panel.scss',
})
export class MainPanel {
  currentView = 'home';

  constructor(private viewService: ViewService) {
    this.viewService.currentView$.subscribe((view) => {
      this.currentView = view;
    });
  }
}
