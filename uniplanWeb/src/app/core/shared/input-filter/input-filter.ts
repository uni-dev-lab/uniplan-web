import {ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatFormField, MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-input-filter',
  standalone: true,
  templateUrl: './input-filter.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './input-filter.scss',
  imports: [MatFormField, MatInputModule, MatIconModule],
})
export class InputFilter {
  public label: InputSignal<string> = input<string>('');
  public searchText: InputSignal<string> = input<string>('');
  public readonly searchTextChange: OutputEmitterRef<string> = output<string>();
}
