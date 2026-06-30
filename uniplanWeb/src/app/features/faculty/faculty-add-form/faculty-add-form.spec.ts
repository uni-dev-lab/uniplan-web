import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { translateTestingProviders } from '@testing/translate-testing';
import { MatDialogRef } from '@angular/material/dialog';
import { FacultyService } from '../faculty-service';
import { UniversityService } from '../../university/university-service';

import { FacultyAddForm } from './faculty-add-form';

describe('FacultyAddForm', () => {
  let component: FacultyAddForm;
  let fixture: ComponentFixture<FacultyAddForm>;

  beforeEach(async () => {
    const facultyServiceSpy = jasmine.createSpyObj('FacultyService', ['createFaculty']);
    const universityServiceSpy = jasmine.createSpyObj('UniversityService', ['getAllUniversities']);
    universityServiceSpy.getAllUniversities.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FacultyAddForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: FacultyService, useValue: facultyServiceSpy },
        { provide: UniversityService, useValue: universityServiceSpy },
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
