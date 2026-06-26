import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-button',
  standalone: true,
  templateUrl: './add-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-button.scss',
  imports: [MatIconModule, TranslatePipe],
})
export class AddButton {
  @Output() addClicked = new EventEmitter<void>();

  onClick(): void {
    this.addClicked.emit();
  }
}
