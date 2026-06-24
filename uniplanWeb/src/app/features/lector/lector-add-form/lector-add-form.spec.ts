import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorAddForm } from './lector-add-form';

describe('LectorAddForm', () => {
  let component: LectorAddForm;
  let fixture: ComponentFixture<LectorAddForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectorAddForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LectorAddForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
