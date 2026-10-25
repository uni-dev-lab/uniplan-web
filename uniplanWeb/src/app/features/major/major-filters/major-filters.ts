import {ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {FiltersForm} from '../../../core/shared/filters-form/filters-form';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {InputFilter} from '../../../core/shared/input-filter/input-filter';
import {TranslatePipe} from '@ngx-translate/core';
import {MajorFilterState} from '../../../core/interfaces/major-filter-state';
import {MajorFilterOptions} from '../../../core/interfaces/major-filter-options';

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
    InputFilter,
    TranslatePipe
  ],
})
export class MajorFilters {
  public majorFilterState: InputSignal<MajorFilterState> = input.required<MajorFilterState>()
  public majorFilterOptions: InputSignal<MajorFilterOptions> = input.required<MajorFilterOptions>()
  public internalSearchText: InputSignal<string> = input<string>('Име на специалността');

  protected facultyChange: OutputEmitterRef<string> = output<string>();
  protected typeChange: OutputEmitterRef<string> = output<string>();
  protected subtypeChange: OutputEmitterRef<string> = output<string>();
  protected searchTextChange: OutputEmitterRef<string> = output<string>();
}
