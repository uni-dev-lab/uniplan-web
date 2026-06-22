import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-delete-form',
  imports: [MatDialogModule, FormsModule, MatInputModule],
  templateUrl: './delete-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './delete-form.scss',
})
export class DeleteForm {
  @Input() public title: string = '';

  @Output() public readonly deleteClicked:EventEmitter<void> = new EventEmitter<void>();
}
