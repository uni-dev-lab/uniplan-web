import { Component } from '@angular/core';

import { FacultyOptions } from '../faculty-options/faculty-options';
import { FacultyTable } from '../faculty-table/faculty-table';

@Component({
  selector: 'app-faculty-panel',
  imports: [FacultyOptions, FacultyTable],
  templateUrl: './faculty-panel.html',
  styleUrl: './faculty-panel.scss'
})
export class FacultyPanel {}
