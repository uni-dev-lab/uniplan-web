import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { translateTestingProviders } from '@testing/translate-testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MajorService } from '../major-service';
import { FacultyService } from '../../faculty/faculty-service';

import { MajorEditForm } from './major-edit-form';

describe('MajorEditForm', () => {
  let component: MajorEditForm;
  let fixture: ComponentFixture<MajorEditForm>;

  beforeEach(async () => {
    const majorServiceSpy = jasmine.createSpyObj('MajorService', ['editMajor']);
    const facultyServiceSpy = jasmine.createSpyObj('FacultyService', ['getFaculties']);
    facultyServiceSpy.getFaculties.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [MajorEditForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { id: '1', majorName: 'Test', facultyId: '1' } },
        { provide: MajorService, useValue: majorServiceSpy },
        { provide: FacultyService, useValue: facultyServiceSpy },
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
