
import { Component, EventEmitter, input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';
import { FacultyService } from '../../faculty/faculty-service';

@Component({
  selector: 'app-major-filters',
  templateUrl: './major-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-filters.scss',
  imports: [
    FiltersForm,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    InputFilter
  ],
})
export class MajorFilters {
  internalSearchText = input<string>('');
  faculties = input<{ id: string; name: string }[]>([]);
  types = input<string[]>([]);
  subtypes = input<string[]>([]);

  selectedFaculty = input<string>('');
  selectedType = input<string>('');
  selectedSubtype = input<string>('');

  @Output() facultyChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() subtypeChange = new EventEmitter<string>();
  @Output() searchTextChange = new EventEmitter<string>();
}
