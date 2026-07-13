import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, throwError, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { translateTestingProviders } from '@testing/translate-testing';
import { SettingsPanel } from './settings-panel';
import { SettingsService } from '../settings-service';
import { StudentProfileElm } from '../../../core/interfaces/student-profile-elm';
import { LectorProfileElm } from '../../../core/interfaces/lector-profile-elm';

describe('SettingsPanel', () => {
  let component: SettingsPanel;
  let fixture: ComponentFixture<SettingsPanel>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  const buildProfile = (
    overrides: Partial<StudentProfileElm> = {}
  ): StudentProfileElm => ({
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

  const buildLectorProfile = (
    overrides: Partial<LectorProfileElm> = {}
  ): LectorProfileElm => ({
    id: 'l1',
    facultyId: 'f1',
    email: 'georgi.goshov@uni.bg',
    firstName: 'Georgi',
    lastName: 'Goshov',
    ...overrides,
  });

  beforeEach(async () => {
    localStorage.removeItem('lang');
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>('SettingsService', [
      'getCurrentStudent',
      'getCurrentLector',
    ]);
    settingsServiceSpy.getCurrentStudent.and.returnValue(of(buildProfile()));
    settingsServiceSpy.getCurrentLector.and.returnValue(of(buildLectorProfile()));

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

    expect(translate.use).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('lang')).toBe('en');
  });

  it('should render the lector profile when currentRole is lector', () => {
    component.currentRole = 'lector';
    fixture.detectChanges();

    expect(settingsServiceSpy.getCurrentLector).toHaveBeenCalled();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.profile-info')?.textContent).toContain(
      'Georgi Goshov'
    );
    expect(compiled.querySelector('.profile-info')?.textContent).toContain(
      'georgi.goshov@uni.bg'
    );
  });

  it('should show an error state when loading the lector profile fails', () => {
    settingsServiceSpy.getCurrentLector.and.returnValue(
      throwError(() => new Error('network error'))
    );
    component.currentRole = 'lector';
    fixture.detectChanges();

    expect(component.loadError).toBeTrue();
    expect(component.loading).toBeFalse();
  });
});
