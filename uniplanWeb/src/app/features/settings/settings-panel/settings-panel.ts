import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { StudentProfileElm } from '../../../core/interfaces/student-profile-elm';
import { LectorProfileElm } from '../../../core/interfaces/lector-profile-elm';
import { SettingsService } from '../settings-service';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '../../../config/language';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.scss',
  imports: [TranslatePipe, MatButtonToggleModule],
})
export class SettingsPanel implements OnInit {
  private translate = inject(TranslateService);
  private settingsService = inject(SettingsService);
  private destroyRef = inject(DestroyRef);

  protected activeLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? DEFAULT_LANGUAGE;

  protected currentRole: 'student' | 'lector' = 'student';

  protected studentProfile: StudentProfileElm | null = null;
  protected lectorProfile: LectorProfileElm | null = null;

  protected loading = true;
  protected loadError = false;

  ngOnInit(): void {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ lang }) => {
        this.activeLanguage = lang;
      });

    if (this.currentRole === 'lector') {
      this.loadProfile(this.settingsService.getCurrentLector(), (profile) => {
        this.lectorProfile = profile;
      });
    } else {
      this.loadProfile(this.settingsService.getCurrentStudent(), (profile) => {
        this.studentProfile = profile;
      });
    }
  }

  protected useLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  private loadProfile<T>(source$: Observable<T>, assign: (value: T) => void): void {
    source$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (value) => {
        assign(value);
        this.loading = false;
      },
      error: () => {
        this.loadError = true;
        this.loading = false;
      },
    });
  }
}
