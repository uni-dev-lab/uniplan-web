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
  @Input() public internalSearchText: string = '';
  @Output() public readonly searchTextChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() public internalSearchFacNum: string = '';
  @Output() public readonly searchFacNumChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() public internalSearchMajor: string = '';
  @Output() public readonly searchMajorChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() public subtypes: string[] = [];
  @Input() public selectedSubtype: string = '';
  @Output() public readonly subtypeChange: EventEmitter<string> = new EventEmitter<string>();
}
