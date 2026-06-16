import { Component, EventEmitter, input, Output, ChangeDetectionStrategy } from '@angular/core';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';

@Component({
  selector: 'app-student-filters',
  imports: [InputFilter, FiltersForm],
  templateUrl: './student-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-filters.scss',
})
export class StudentFilters {
  internalSearchText = input<string>('');
  @Output() searchTextChange = new EventEmitter<string>();

  internalSearchFacNum = input<string>('');
  @Output() searchFacNumChange = new EventEmitter<string>();

  internalSearchMajor = input<string>('');
  @Output() searchMajorChange = new EventEmitter<string>();

  subtypes = input<string[]>([]);
  selectedSubtype = input<string>('');
  @Output() subtypeChange = new EventEmitter<string>();
}
