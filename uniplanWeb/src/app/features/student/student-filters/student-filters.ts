import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, input, output, effect, OnInit } from '@angular/core';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-student-filters',
  templateUrl: './student-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-filters.scss',
  imports: [InputFilter,
    FiltersForm,
    TranslatePipe,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    ReactiveFormsModule,
    AsyncPipe],
})
export class StudentFilters implements OnInit{
  @Input() internalSearchText = '';
  @Output() searchTextChange = new EventEmitter<string>();

  @Input() internalSearchFacNum = '';
  @Output() searchFacNumChange = new EventEmitter<string>();

  majorSuggestions = input<string[]>([]);
  internalSearchMajor = input('');
  searchMajorChange = output<string>();

  majorControl = new FormControl('');
  filteredMajors$!: Observable<string[]>;

  @Input() subtypes: string[] = [];
  @Input() selectedSubtype = '';
  @Output() subtypeChange = new EventEmitter<string>();

  constructor() {
    effect(() => {
      this.majorControl.setValue(this.internalSearchMajor(), { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.filteredMajors$ = this.majorControl.valueChanges.pipe(
      startWith(this.majorControl.value ?? ''),
      map(value => this._filterMajors(value ?? ''))
    );
  }

  onMajorChange(value: string): void {
    this.searchMajorChange.emit(value);
  }

  private _filterMajors(value: string): string[] {
    if (!value) return [];
    const lower = value.toLowerCase();
    return this.majorSuggestions().filter(m => m.toLowerCase().includes(lower));
  }
}
