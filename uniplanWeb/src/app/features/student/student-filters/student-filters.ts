import { Component, ChangeDetectionStrategy, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-student-filters',
  templateUrl: './student-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './student-filters.scss',
  imports: [InputFilter, FiltersForm, TranslatePipe],
})
export class StudentFilters {
  public readonly internalSearchText: InputSignal<string> = input<string>('');
  public readonly searchTextChange: OutputEmitterRef<string> = output<string>();

  public readonly internalSearchFacNum: InputSignal<string> = input<string>('');
  public readonly searchFacNumChange: OutputEmitterRef<string> = output<string>();

  public readonly internalSearchMajor: InputSignal<string> = input<string>('');
  public readonly searchMajorChange: OutputEmitterRef<string> = output<string>();

  public readonly subtypes: InputSignal<string[]> = input<string[]>([]);
  public readonly selectedSubtype: InputSignal<string> = input<string>('');
  public readonly subtypeChange: OutputEmitterRef<string> = output<string>();
}
