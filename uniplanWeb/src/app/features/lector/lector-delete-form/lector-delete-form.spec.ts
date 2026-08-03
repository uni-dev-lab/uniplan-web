import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorDeleteForm } from './lector-delete-form';

describe('LectorDeleteForm', () => {
  let fixture: ComponentFixture<LectorDeleteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectorDeleteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LectorDeleteForm);
    fixture.detectChanges();
  });
});
