import { Component, EventEmitter, input, model, Output, ChangeDetectionStrategy } from '@angular/core';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';

@Component({
  selector: 'app-student-filters',
  templateUrl: './student-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-filters.scss',
  imports: [InputFilter, FiltersForm],
})
export class StudentFilters {
  internalSearchText = model<string>('');
  @Output() searchTextChange = new EventEmitter<string>();

  internalSearchFacNum = model<string>('');
  @Output() searchFacNumChange = new EventEmitter<string>();

  internalSearchMajor = model<string>('');
  @Output() searchMajorChange = new EventEmitter<string>();

  subtypes = input<string[]>([]);
  selectedSubtype = input<string>('');
  @Output() subtypeChange = new EventEmitter<string>();
}
