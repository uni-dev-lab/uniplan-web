import { Component, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateDirective, TranslateService } from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  imports: [TranslatePipe, TranslateDirective,MatButtonModule],

})
export class Settings {
  private translate = inject(TranslateService);

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
