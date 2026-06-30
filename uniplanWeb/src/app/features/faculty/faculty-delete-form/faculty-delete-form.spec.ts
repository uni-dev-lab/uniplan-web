import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FacultyDeleteForm } from './faculty-delete-form';

describe('FacultyDeleteForm', () => {
  let component: FacultyDeleteForm;
  let fixture: ComponentFixture<FacultyDeleteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyDeleteForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultyDeleteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
