import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings-service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the current student profile', (done) => {
    service.getCurrentStudent().subscribe((profile) => {
      expect(profile.name).toBe('Иван Иванов');
      expect(profile.facultyNumber).toBe('123456');
      done();
    });
  });
});
