import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorEditForm } from './lector-edit-form';

describe('LectorEditForm', () => {
  let component: LectorEditForm;
  let fixture: ComponentFixture<LectorEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectorEditForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LectorEditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
