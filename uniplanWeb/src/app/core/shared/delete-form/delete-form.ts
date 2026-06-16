import { Component, EventEmitter, input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './delete-form.scss',
  imports: [MatDialogModule, FormsModule, MatInputModule],
})
export class DeleteForm {
  title=input<string>('');

  @Output() deleteClicked = new EventEmitter<void>();
}
