import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, throwError, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { translateTestingProviders } from '@testing/translate-testing';
import { SettingsPanel } from './settings-panel';
import { SettingsService } from '../settings-service';
import { StudentProfile } from '../../../core/interfaces/student-profile';

describe('SettingsPanel', () => {
  let component: SettingsPanel;
  let fixture: ComponentFixture<SettingsPanel>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  const buildProfile = (
    overrides: Partial<StudentProfile> = {}
  ): StudentProfile => ({
    id: '1',
    name: 'Ivan Ivanov',
    facultyNumber: '123456',
    majorId: 'm1',
    majorName: 'Computer Science',
    courseType: 'bachelor',
    courseSubtype: 'full-time',
    courseYear: 3,
    ...overrides,
  });

  beforeEach(async () => {
    localStorage.removeItem('lang');
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>('SettingsService', [
      'getCurrentStudent',
    ]);
    settingsServiceSpy.getCurrentStudent.and.returnValue(of(buildProfile()));

    await TestBed.configureTestingModule({
      imports: [SettingsPanel],
      providers: [
        ...translateTestingProviders,
        { provide: SettingsService, useValue: settingsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPanel);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.removeItem('lang');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default the active language to bg when nothing is stored', () => {
    fixture.detectChanges();
    expect(component.activeLanguage).toBe('bg');
  });

  it('should show a loading state before the profile resolves', () => {
    settingsServiceSpy.getCurrentStudent.and.returnValue(new Subject());
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.loading).toBeTrue();
    expect(compiled.querySelector('.profile-card p')).toBeTruthy();
    expect(compiled.querySelector('.profile-info')).toBeFalsy();
  });

  it('should render the resolved student profile', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.profile-info')?.textContent).toContain(
      'Ivan Ivanov'
    );
    expect(compiled.querySelector('.profile-info')?.textContent).toContain(
      '123456'
    );
  });

  it('should show an error state when loading the profile fails', () => {
    settingsServiceSpy.getCurrentStudent.and.returnValue(
      throwError(() => new Error('network error'))
    );
    fixture.detectChanges();

    expect(component.loadError).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should persist the chosen language and mark it active', () => {
    fixture.detectChanges();
    const translate = TestBed.inject(TranslateService);
    spyOn(translate, 'use').and.callThrough();

    component.useLanguage('en');
    fixture.detectChanges();

    expect(translate.use).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('lang')).toBe('en');
    expect(component.activeLanguage).toBe('en');
    const checkedToggle = (fixture.nativeElement as HTMLElement).querySelector(
      'mat-button-toggle.mat-button-toggle-checked'
    );
    expect(checkedToggle?.textContent).toContain('settings.english');
  });
});
