import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
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
  @Input() internalSearchText = '';
  @Output() searchTextChange = new EventEmitter<string>();

  @Input() internalSearchFacNum = '';
  @Output() searchFacNumChange = new EventEmitter<string>();

  @Input() internalSearchMajor = '';
  @Output() searchMajorChange = new EventEmitter<string>();

  @Input() subtypes: string[] = [];
  @Input() selectedSubtype = '';
  @Output() subtypeChange = new EventEmitter<string>();
}
