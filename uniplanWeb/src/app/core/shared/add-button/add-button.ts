import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-button',
  imports: [MatIconModule],
  standalone: true,
  templateUrl: './add-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-button.scss',
})
export class AddButton {
  @Output() addClicked = new EventEmitter<void>();

  public onClick(): void {
    this.addClicked.emit();
  }
}
