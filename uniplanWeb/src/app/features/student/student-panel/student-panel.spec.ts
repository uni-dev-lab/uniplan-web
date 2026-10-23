import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { translateTestingProviders } from '@testing/translate-testing';

import { StudentPanel } from './student-panel';
import { StudentFilters } from '../student-filters/student-filters';
import { StudentTable } from '../student-table/student-table';
import { StudentService } from "../student-service";
import {of, Subject } from "rxjs";
import {StudentElm} from '../../../core/interfaces/student-elm';

describe('StudentPanel', () => {
  let component: StudentPanel;
  let fixture: ComponentFixture<StudentPanel>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  const students: StudentElm[] = [
    {
      id: 's1',
      position: 1,
      name: 'Ivan Ivanov',
      facultyNumber: '123456',
      majorId: 'm1',
      majorName: 'Computer Science',
      courseType: 'bachelor',
      courseSubtype: 'редовно',
      courseYear: 3,
    },
    {
      id: 's2',
      position: 2,
      name: 'Maria Petrova',
      facultyNumber: '234567',
      majorId: 'm2',
      majorName: 'History',
      courseType: 'bachelor',
      courseSubtype: 'задочно',
      courseYear: 2,
    },
  ];

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    studentServiceSpy = jasmine.createSpyObj<StudentService>(
      'StudentService',
      ['getStudents'],
      { refreshNeeded: new Subject<void>() }
    );
    studentServiceSpy.getStudents.and.returnValue(of(students));

    await TestBed.configureTestingModule({
      imports: [StudentPanel],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialog, useValue: dialogSpy },
        { provide: StudentService, useValue: studentServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentPanel);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should derive the available subtypes from the student data on init', () => {
    fixture.detectChanges();
    expect(component.studentSubtypes).toEqual(['редовно', 'задочно']);
  });

  it('should render the student options, filters and table', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-student-options')).toBeTruthy();
    expect(compiled.querySelector('app-student-filters')).toBeTruthy();
    expect(compiled.querySelector('app-student-table')).toBeTruthy();
  });

  it('should propagate a faculty-number search from filters down to the table and filter the rendered rows', () => {
    fixture.detectChanges();

    const filters = fixture.debugElement.query(By.directive(StudentFilters))
      .componentInstance as StudentFilters;
    filters.searchFacNumChange.emit('123456');
    fixture.detectChanges();

    expect(component.searchFacNum).toBe('123456');
    const table = fixture.debugElement.query(By.directive(StudentTable))
      .componentInstance as StudentTable;
    expect(table.searchFacNum).toBe('123456');

    const compiled = fixture.nativeElement as HTMLElement;
    const names = Array.from(compiled.querySelectorAll('td.col-name')).map(
      (el) => el.textContent?.trim()
    );
    expect(names).toEqual(['Ivan Ivanov']);
  });

  it('should propagate the selected subtype from filters down to the table', () => {
    fixture.detectChanges();

    const filters = fixture.debugElement.query(By.directive(StudentFilters))
      .componentInstance as StudentFilters;
    filters.subtypeChange.emit('задочно');
    fixture.detectChanges();

    expect(component.selectedStudentSubtype).toBe('задочно');
    const table = fixture.debugElement.query(By.directive(StudentTable))
      .componentInstance as StudentTable;
    expect(table.subtype).toBe('задочно');
  });
});
