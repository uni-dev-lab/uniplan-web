import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorFilters } from './lector-filters';

describe('LectorFilters', () => {
  let fixture: ComponentFixture<LectorFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectorFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(LectorFilters);
    fixture.detectChanges();
  });
});
