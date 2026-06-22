import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-form',
  imports: [MatDialogModule],
  standalone: true,
  templateUrl: './edit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './edit-form.scss',
})
export class EditForm {
  @Input() public title: string = '';

  @Output() public readonly saveClicked:EventEmitter<void> = new EventEmitter<void>();
}
