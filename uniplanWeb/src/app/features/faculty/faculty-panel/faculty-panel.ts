import { Component } from '@angular/core';

import { FacultyOptions } from '../faculty-options/faculty-options';
import { FacultyTable } from '../faculty-table/faculty-table';

@Component({
  selector: 'app-faculty-panel',
  standalone: true,
  imports: [FacultyOptions, FacultyTable],
  templateUrl: './faculty-panel.html',
})
export class FacultyPanel {}
