import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { StudentProfile } from '../../../core/interfaces/student-profile';
import { SettingsService } from '../settings-service';
import { getStoredLanguage, LANGUAGE_STORAGE_KEY } from '../../../config/language';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.scss',
  imports: [TranslatePipe, MatButtonToggleModule],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SettingsPanel implements OnInit {
  private translate = inject(TranslateService);
  private settingsService = inject(SettingsService);
  private destroyRef = inject(DestroyRef);

  activeLanguage = getStoredLanguage();

  studentProfile: StudentProfile | null = null;

  loading = true;
  loadError = false;

  ngOnInit(): void {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ lang }) => {
        this.activeLanguage = lang;
      });

    this.settingsService
      .getCurrentStudent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.studentProfile = profile;
          this.loading = false;
        },
        error: () => {
          this.loadError = true;
          this.loading = false;
        },
      });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}
