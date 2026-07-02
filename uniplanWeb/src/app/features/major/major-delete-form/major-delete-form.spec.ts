import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MajorDeleteForm } from './major-delete-form';

describe('MajorDeleteForm', () => {
  let component: MajorDeleteForm;
  let fixture: ComponentFixture<MajorDeleteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorDeleteForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MajorDeleteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
