import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MajorEditForm } from './major-edit-form';

describe('MajorEditForm', () => {
  let component: MajorEditForm;
  let fixture: ComponentFixture<MajorEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorEditForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MajorEditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
