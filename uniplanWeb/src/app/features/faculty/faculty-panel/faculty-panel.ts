import { Component } from '@angular/core';

import { FacultyOptions } from '../faculty-options/faculty-options';
import { FacultyTable } from '../faculty-table/faculty-table';

@Component({
  selector: 'app-faculty-panel',
  standalone: true,
  imports: [FacultyOptions, FacultyTable],
  template: `
    <div class="component-panel faculty">
      <app-faculty-options></app-faculty-options>
      <app-faculty-table></app-faculty-table>
    </div>
  `,
})
export class FacultyPanel {}
