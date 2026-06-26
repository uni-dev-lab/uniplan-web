import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FacultyEdit } from './faculty-edit';

describe('FacultyEdit', () => {
  let component: FacultyEdit;
  let fixture: ComponentFixture<FacultyEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyEdit],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultyEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
