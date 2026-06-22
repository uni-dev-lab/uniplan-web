
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-filters-form',
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule],
  standalone: true,
  templateUrl: './filters-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './filters-form.scss',
})
export class FiltersForm {
  @Input() public label: string = '';

  @Input() public options: string[] = [];

  @Input() public objectOptions: { id: string; name: string }[] = [];

  @Input() public selected = '';
  @Output() public readonly selectionChange = new EventEmitter<string>();

  public onChange(value: string) {
    this.selectionChange.emit(value);
  }

  public isObjectMode(): boolean {
    return this.objectOptions && this.objectOptions.length > 0;
  }
}
