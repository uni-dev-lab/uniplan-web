import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-lector-filters',
  imports: [
    FiltersForm,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    InputFilter,
    TranslatePipe,
  ],
  templateUrl: './lector-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-filters.scss',
})
export class LectorFilters {
  readonly internalSearchText = input('');

  readonly faculties = input<{ id: string; name: string }[]>([]);

  readonly selectedFaculty = input('');

  readonly facultyChange = output<string>();
  readonly searchTextChange = output<string>();
}
