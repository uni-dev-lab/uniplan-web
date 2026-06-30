import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { translateTestingProviders } from '@testing/translate-testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MajorService } from '../major-service';
import { FacultyService } from '../../faculty/faculty-service';

import { MajorAddForm } from './major-add-form';

describe('MajorAddForm', () => {
  let component: MajorAddForm;
  let fixture: ComponentFixture<MajorAddForm>;

  beforeEach(async () => {
    const majorServiceSpy = jasmine.createSpyObj('MajorService', ['createMajorWithCourse']);
    const facultyServiceSpy = jasmine.createSpyObj('FacultyService', ['getFaculties']);
    facultyServiceSpy.getFaculties.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [MajorAddForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
        { provide: MajorService, useValue: majorServiceSpy },
        { provide: FacultyService, useValue: facultyServiceSpy },
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
