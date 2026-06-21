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
  @Input() internalSearchText: string = '';
  @Output() searchTextChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() internalSearchFacNum: string = '';
  @Output() searchFacNumChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() internalSearchMajor: string = '';
  @Output() searchMajorChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() subtypes: string[] = [];
  @Input() selectedSubtype: string = '';
  @Output() subtypeChange: EventEmitter<string> = new EventEmitter<string>();
}
