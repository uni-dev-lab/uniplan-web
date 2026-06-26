import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MatDialogRef } from '@angular/material/dialog';

import { MajorAddForm } from './major-add-form';

describe('MajorAddForm', () => {
  let component: MajorAddForm;
  let fixture: ComponentFixture<MajorAddForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorAddForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MajorAddForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
