import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-form',
  standalone: true,
  templateUrl: './add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-form.scss',
  imports: [MatDialogModule, FormsModule, MatInputModule, TranslatePipe],
})
export class AddForm {
  @Input() title: string = '';

  @Output() saveClicked = new EventEmitter<void>();
}
