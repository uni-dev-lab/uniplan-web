import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { translateTestingProviders } from '@testing/translate-testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MajorService } from '../../major/major-service';
import { CourseService } from '../../course/course-service';
import { StudentService } from '../student-service';
import { StudentAddForm } from './student-add-form';

describe('StudentAddForm', () => {
  let component: StudentAddForm;
  let fixture: ComponentFixture<StudentAddForm>;
  let majorServiceSpy: jasmine.SpyObj<MajorService>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  beforeEach(async () => {
    majorServiceSpy = jasmine.createSpyObj('MajorService', ['getMajors']);
    courseServiceSpy = jasmine.createSpyObj('CourseService', ['getCoursesByMajorId']);
    studentServiceSpy = jasmine.createSpyObj('StudentService', ['createStudent']);

    majorServiceSpy.getMajors.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [StudentAddForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MajorService, useValue: majorServiceSpy },
        { provide: CourseService, useValue: courseServiceSpy },
        { provide: StudentService, useValue: studentServiceSpy },
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