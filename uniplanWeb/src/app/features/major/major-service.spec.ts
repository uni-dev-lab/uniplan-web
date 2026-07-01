import { TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MajorService } from './major-service';

describe('MajorService', () => {
  let service: MajorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...translateTestingProviders,
      ],
    });
    service = TestBed.inject(MajorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
