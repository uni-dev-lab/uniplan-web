import { Component, ViewChild, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './table.scss',
})
export class Table {}
