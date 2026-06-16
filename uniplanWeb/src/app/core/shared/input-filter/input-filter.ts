
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-filter',
  imports: [MatFormField, MatInputModule, MatIconModule],
  standalone: true,
  templateUrl: './input-filter.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './input-filter.scss',
})
export class InputFilter {
  @Input() label: string = '';
  @Input() searchText = '';
  @Output() searchTextChange = new EventEmitter<string>();
}
