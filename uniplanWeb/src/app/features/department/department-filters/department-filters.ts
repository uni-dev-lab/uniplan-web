import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';

@Component({
  selector: 'app-department-filters',
  imports: [
    FiltersForm,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    InputFilter,
  ],
  templateUrl: './department-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './department-filters.scss',
})
export class DepartmentFilters {
  @Input() internalSearchText = '';

  @Input() faculties: { id: string; name: string }[] = [];

  @Input() selectedFaculty = '';

  @Output() facultyChange = new EventEmitter<string>();
  @Output() searchTextChange = new EventEmitter<string>();
}
