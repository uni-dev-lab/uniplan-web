import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
  imports: [RouterOutlet,
    MatSlideToggleModule,
  ],
})
export class App {
  protected title = 'uniplanWeb';

  constructor() {
    const unusedCiTestVar = 'trigger eslint error';
  }
}
