import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MatDialogRef } from '@angular/material/dialog';

import { FacultyAddForm } from './faculty-add-form';

describe('FacultyAddForm', () => {
  let component: FacultyAddForm;
  let fixture: ComponentFixture<FacultyAddForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyAddForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultyAddForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
