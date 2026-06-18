import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  templateUrl: './edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './edit-form.scss',
  imports: [MatDialogModule, TranslatePipe, TranslateDirective],

})
export class EditForm {
  @Input() title: string = '';

  @Output() saveClicked = new EventEmitter<void>();
}
