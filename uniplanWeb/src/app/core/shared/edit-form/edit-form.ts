import { Component, EventEmitter, input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  templateUrl: './edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './edit-form.scss',
  imports: [MatDialogModule, TranslatePipe],

})
export class EditForm {
  title = input<string>('');

  @Output() saveClicked = new EventEmitter<void>();
}
