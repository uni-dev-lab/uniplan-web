import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorOptions } from './lector-options';

describe('LectorOptions', () => {
  let fixture: ComponentFixture<LectorOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectorOptions],
    }).compileComponents();

    fixture = TestBed.createComponent(LectorOptions);
    fixture.detectChanges();
  });
});
