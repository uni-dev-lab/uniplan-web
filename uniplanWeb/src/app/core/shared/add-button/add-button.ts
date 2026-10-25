import {ChangeDetectionStrategy, Component, output, OutputEmitterRef} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-add-button',
  standalone: true,
  templateUrl: './add-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-button.scss',
  imports: [MatIconModule, TranslatePipe],
})
export class AddButton {
  public addClicked: OutputEmitterRef<void> = output<void>();

  protected onClick(): void {
    this.addClicked.emit();
  }
}
