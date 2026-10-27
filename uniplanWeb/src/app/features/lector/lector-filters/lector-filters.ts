import {ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {FiltersForm} from '../../../core/shared/filters-form/filters-form';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {InputFilter} from '../../../core/shared/input-filter/input-filter';
import {TranslatePipe} from '@ngx-translate/core';
import {LectorFilterState} from '../../../core/interfaces/lector-filter-state';

@Component({
  selector: 'app-lector-filters',
  templateUrl: './lector-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-filters.scss',
  imports: [
    FiltersForm,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    InputFilter,
    TranslatePipe,
  ],
})
export class LectorFilters {
  public lectorFiltersState: InputSignal<LectorFilterState> = input.required<LectorFilterState>();

  public readonly facultyChange: OutputEmitterRef<string> = output<string>();
  public readonly searchTextChange: OutputEmitterRef<string> = output<string>();
}
