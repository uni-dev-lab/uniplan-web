
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';
import { FacultyService } from '../../faculty/faculty-service';

@Component({
  selector: 'app-major-filters',
  imports: [
    FiltersForm,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    InputFilter
],
  templateUrl: './major-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-filters.scss',
})
export class MajorFilters {
  @Input() public internalSearchText = '';

  @Input() public faculties: { id: string; name: string }[] = [];

  @Input() public types: string[] = [];
  @Input() public subtypes: string[] = [];

  @Input() public selectedFaculty: string = '';
  @Input() public selectedType: string = '';
  @Input() public selectedSubtype: string = '';

  @Output() public readonly facultyChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public readonly typeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public readonly subtypeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public readonly searchTextChange: EventEmitter<string> = new EventEmitter<string>();
}
