import { Component } from '@angular/core';
import { Table } from './table/table';
import { FacultyOptions } from '../../../features/faculty/faculty-options/faculty-options';
import { ViewService } from './view.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-panel',
  imports: [CommonModule, Table, FacultyOptions],
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
