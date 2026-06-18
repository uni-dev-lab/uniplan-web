import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './delete-form.scss',
  imports: [MatDialogModule, FormsModule, MatInputModule, TranslatePipe, TranslateDirective],
})
export class DeleteForm {
  @Input() title: string = '';

  @Output() deleteClicked = new EventEmitter<void>();
}
