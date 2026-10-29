import {ComponentFixture, TestBed} from '@angular/core/testing';
import {translateTestingProviders} from '@testing/translate-testing';

import {StudentTable} from './student-table';
import {StudentService} from '../student-service';
import {of, Subject, throwError} from 'rxjs';
import {StudentElm} from '../../../core/interfaces/student-elm';

describe('StudentTable', () => {
  let component: StudentTable;
  let fixture: ComponentFixture<StudentTable>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>

  const student1: StudentElm = {
    id: 's1',
    position: 1,
    name: 'Peter',
    facultyNumber: '123456',
    majorId: 'm1',
    majorName: 'Computer Science',
    courseType: 'bachelor',
    courseSubtype: 'редовно',
    courseYear: 2
  }

  const student2: StudentElm = {
    id: 's2',
    position: 2,
    name: 'Ivan',
    facultyNumber: '654321',
    majorId: 'm2',
    majorName: 'mName2',
    courseType: 'master',
    courseSubtype: 'задочно',
    courseYear: 1
  }

  beforeEach(async () => {

    studentServiceSpy = jasmine.createSpyObj<StudentService>(
      'StudentService',
      ['getStudents'],
      {refreshNeeded: new Subject<void>()}
    )

    studentServiceSpy.getStudents.and.returnValue(of([student1, student2]))

    await TestBed.configureTestingModule({
      imports: [StudentTable],
      providers: [
        ...translateTestingProviders,
        {provide: StudentService, useValue: studentServiceSpy}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentTable);
    component = fixture.componentInstance;
  });

  function getRenderedNames(): (string | undefined)[] {
    const compiled = fixture.nativeElement as HTMLElement;
    return Array.from(compiled.querySelectorAll('td.col-name')).map(
      (el) => el.textContent?.trim()
    );
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the students returned by the service', () => {
    fixture.detectChanges();

    expect(studentServiceSpy.getStudents).toHaveBeenCalledTimes(1);
    expect(getRenderedNames()).toEqual(['Peter', 'Ivan']);
  });

  it('should emit the distinct subtypes once students are loaded', () => {
    let emitted: string[] = [];
    component.subtypesLoaded.subscribe((subtypes: string[]) => emitted = subtypes);

    fixture.detectChanges();

    expect(emitted).toEqual(['редовно', 'задочно']);
  });

  it('should filter rows by faculty number', () => {
    fixture.detectChanges();

    fixture.componentRef.setInput('searchFacNum', '654321');
    fixture.detectChanges();

    expect(getRenderedNames()).toEqual(['Ivan']);
  });

  it('should filter rows by subtype', () => {
    fixture.detectChanges();

    fixture.componentRef.setInput('subtype', 'задочно');
    fixture.detectChanges();

    expect(getRenderedNames()).toEqual(['Ivan']);
  });

  it('should reload students when refreshNeeded fires', () => {
    fixture.detectChanges();
    expect(getRenderedNames()).toEqual(['Peter', 'Ivan']);

    studentServiceSpy.getStudents.and.returnValue(of([student1]));
    studentServiceSpy.refreshNeeded.next();
    fixture.detectChanges();

    expect(studentServiceSpy.getStudents).toHaveBeenCalledTimes(2);
    expect(getRenderedNames()).toEqual(['Peter']);
  });

  it('should render an empty table when loading fails', () => {
    studentServiceSpy.getStudents.and.returnValue(throwError(() => new Error('500')));

    fixture.detectChanges();

    expect(getRenderedNames()).toEqual([]);
  });

  it('should keep reacting to refreshNeeded after a failed load', () => {
    studentServiceSpy.getStudents.and.returnValue(throwError(() => new Error('500')));
    fixture.detectChanges();

    studentServiceSpy.getStudents.and.returnValue(of([student1, student2]));
    studentServiceSpy.refreshNeeded.next();
    fixture.detectChanges();

    expect(getRenderedNames()).toEqual(['Peter', 'Ivan']);
  });
});
