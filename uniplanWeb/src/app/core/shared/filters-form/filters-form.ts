import {ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {MatOptionModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-filters-form',
  standalone: true,
  templateUrl: './filters-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './filters-form.scss',
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, TranslatePipe],
})
export class FiltersForm {
  public label: InputSignal<string> = input<string>('');

  public options: InputSignal<string[]> = input<string[]>([]);

  public objectOptions: InputSignal<{ id: string; name: string }[]> = input<{ id: string; name: string }[]>([]);

  public selected: InputSignal<string> = input<string>('');
  public readonly selectionChange: OutputEmitterRef<string> = output<string>();

  public onChange(value: string): void {
    this.selectionChange.emit(value);
  }

  public isObjectMode(): boolean {
    return this.objectOptions() && this.objectOptions().length > 0;
  }
}
