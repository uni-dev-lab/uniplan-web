
import { Component, EventEmitter, input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-filter',
  standalone: true,
  templateUrl: './input-filter.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './input-filter.scss',
  imports: [MatFormField, MatInputModule, MatIconModule],
})
export class InputFilter {
  label = input<string>('');
  searchText = input<string>('');
  @Output() searchTextChange = new EventEmitter<string>();
}
