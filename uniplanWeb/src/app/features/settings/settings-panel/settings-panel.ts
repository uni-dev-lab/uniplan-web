import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { StudentProfile } from '../../../core/interfaces/student-profile';
import { LectorProfile } from '../../../core/interfaces/lector-profile';
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

  activeLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? DEFAULT_LANGUAGE;

  currentRole: 'student' | 'lector' = 'student';

  studentProfile: StudentProfile | null = null;
  lectorProfile: LectorProfile | null = null;

  loading = true;
  loadError = false;

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

  useLanguage(language: string): void {
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
