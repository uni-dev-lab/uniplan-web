
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-filters-form',
  standalone: true,
  templateUrl: './filters-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './filters-form.scss',
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, TranslatePipe, TranslateDirective],
})
export class FiltersForm {
  @Input() label = '';

  @Input() options: string[] = [];

  @Input() objectOptions: { id: string; name: string }[] = [];

  @Input() selected = '';
  @Output() selectionChange = new EventEmitter<string>();

  onChange(value: string) {
    this.selectionChange.emit(value);
  }

  isObjectMode(): boolean {
    return this.objectOptions && this.objectOptions.length > 0;
  }
}
