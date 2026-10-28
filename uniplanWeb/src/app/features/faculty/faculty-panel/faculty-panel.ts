import { Component } from '@angular/core';

import { FacultyOptions } from '../faculty-options/faculty-options';
import { FacultyTable } from '../faculty-table/faculty-table';

@Component({
  selector: 'app-faculty-panel',
  templateUrl: './faculty-panel.html',
  styleUrl: './faculty-panel.scss',
  imports: [FacultyOptions, FacultyTable]
})
export class FacultyPanel {}
