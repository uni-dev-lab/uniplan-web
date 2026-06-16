import { Component, EventEmitter, input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-form',
  standalone: true,
  templateUrl: './add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-form.scss',
  imports: [MatDialogModule, FormsModule, MatInputModule],
})
export class AddForm {
  title=input<string>('');

  @Output() saveClicked = new EventEmitter<void>();
}
