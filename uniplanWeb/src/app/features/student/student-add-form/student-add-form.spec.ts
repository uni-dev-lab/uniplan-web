import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { StudentAddForm } from './student-add-form';

describe('StudentAddForm', () => {
  let component: StudentAddForm;
  let fixture: ComponentFixture<StudentAddForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAddForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentAddForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
