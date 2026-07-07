import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { translateTestingProviders } from '@testing/translate-testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MajorService } from '../../major/major-service';
import { CourseService } from '../../course/course-service';
import { StudentService } from '../student-service';
import { StudentEditForm } from './student-edit-form';

describe('StudentEditForm', () => {
  let component: StudentEditForm;
  let fixture: ComponentFixture<StudentEditForm>;
  let majorServiceSpy: jasmine.SpyObj<MajorService>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  beforeEach(async () => {
    majorServiceSpy = jasmine.createSpyObj('MajorService', ['getMajors']);
    courseServiceSpy = jasmine.createSpyObj('CourseService', ['getCoursesByMajorId']);
    studentServiceSpy = jasmine.createSpyObj('StudentService', ['editStudent']);

    majorServiceSpy.getMajors.and.returnValue(of([]));
    courseServiceSpy.getCoursesByMajorId.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [StudentEditForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: '1',
            name: 'Test Student',
            facultyNumber: '12345',
            majorId: 'm1',
            courseSubtype: 'A',
            courseType: 'B',
            courseYear: 2024,
          },
        },
        { provide: MajorService, useValue: majorServiceSpy },
        { provide: CourseService, useValue: courseServiceSpy },
        { provide: StudentService, useValue: studentServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentEditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});