import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-major-filters',
  imports: [
    CommonModule,
    FiltersForm,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  standalone: true,
  templateUrl: './major-filters.html',
  styleUrl: './major-filters.scss',
})
export class MajorFilters {
  @Input() searchText = '';
  @Output() searchTextChange = new EventEmitter<string>();

  @Input() faculties: string[] = [];
  @Input() types: string[] = [];
  @Input() subtypes: string[] = [];

  @Input() selectedFaculty = '';
  @Input() selectedType = '';
  @Input() selectedSubtype = '';

  @Output() facultyChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() subtypeChange = new EventEmitter<string>();
}
