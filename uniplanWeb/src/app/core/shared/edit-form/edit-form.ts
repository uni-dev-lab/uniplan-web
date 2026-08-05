import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
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
  @Input() public title: string = '';

  @Output() public readonly saveClicked:EventEmitter<void> = new EventEmitter<void>();
}
