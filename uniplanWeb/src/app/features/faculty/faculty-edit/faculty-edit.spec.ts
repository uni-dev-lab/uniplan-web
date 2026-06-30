import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacultyService } from '../faculty-service';

import { FacultyEdit } from './faculty-edit';

describe('FacultyEdit', () => {
  let component: FacultyEdit;
  let fixture: ComponentFixture<FacultyEdit>;

  beforeEach(async () => {
    const facultyServiceSpy = jasmine.createSpyObj('FacultyService', ['editFaculty']);

    await TestBed.configureTestingModule({
      imports: [FacultyEdit],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { id: '1', facultyName: 'Test', location: 'Test', universityId: '1' } },
        { provide: FacultyService, useValue: facultyServiceSpy },
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
