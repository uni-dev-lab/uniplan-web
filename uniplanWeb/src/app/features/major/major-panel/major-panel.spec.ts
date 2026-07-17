import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { translateTestingProviders } from '@testing/translate-testing';

import { MajorPanel } from './major-panel';
import { MajorService } from '../major-service';
import { MajorTable } from '../major-table/major-table';
import { MajorFilters } from '../major-filters/major-filters';
import { FacultyService } from '../../faculty/faculty-service';
import { Major } from '../../../core/interfaces/major';
import { Faculty } from '../../../core/interfaces/faculty';

describe('MajorPanel', () => {
  let component: MajorPanel;
  let fixture: ComponentFixture<MajorPanel>;
  let majorServiceSpy: jasmine.SpyObj<MajorService>;
  let facultyServiceSpy: jasmine.SpyObj<FacultyService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const faculty: Faculty = {
    id: 'f1',
    facultyName: 'Faculty of Engineering',
    location: 'Sofia',
    universityId: 'u1',
    position: 1,
  };

  const major: Major = {
    id: 'm1',
    courseId: 'c1',
    facultyId: 'f1',
    majorName: 'Computer Science',
    courseType: 'bachelor',
    courseSubtype: 'full-time',
    position: 1,
  };

  beforeEach(async () => {
    majorServiceSpy = jasmine.createSpyObj<MajorService>(
      'MajorService',
      ['getMajors'],
      { refreshNeeded: new Subject<void>() }
    );
    majorServiceSpy.getMajors.and.returnValue(of([major]));

    facultyServiceSpy = jasmine.createSpyObj<FacultyService>(
      'FacultyService',
      ['getFaculties'],
      { refreshNeeded: new Subject<void>() }
    );
    facultyServiceSpy.getFaculties.and.returnValue(of([faculty]));

    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [MajorPanel],
      providers: [
        ...translateTestingProviders,
        { provide: MajorService, useValue: majorServiceSpy },
        { provide: FacultyService, useValue: facultyServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MajorPanel);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the major options, filters and table', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-major-options')).toBeTruthy();
    expect(compiled.querySelector('app-major-filters')).toBeTruthy();
    expect(compiled.querySelector('app-major-table')).toBeTruthy();
  });

  it('should populate filter options from faculty and major data on init', () => {
    fixture.detectChanges();

    expect(facultyServiceSpy.getFaculties).toHaveBeenCalled();
    expect(majorServiceSpy.getMajors).toHaveBeenCalled();
    expect(component.faculties).toEqual([
      { id: 'f1', name: 'Faculty of Engineering' },
    ]);
    expect(component.types).toEqual(['bachelor']);
    expect(component.subtypes).toEqual(['full-time']);
  });

  it('should leave filter options empty when there are no majors', () => {
    majorServiceSpy.getMajors.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.faculties).toEqual([]);
    expect(component.types).toEqual([]);
    expect(component.subtypes).toEqual([]);
  });

  it('should reload filter options when majorService.refreshNeeded fires', () => {
    fixture.detectChanges();
    expect(component.types).toEqual(['bachelor']);

    majorServiceSpy.getMajors.and.returnValue(
      of([{ ...major, courseType: 'master' }])
    );
    majorServiceSpy.refreshNeeded.next();

    expect(component.types).toEqual(['master']);
  });

  it('should propagate faculty selection from filters down to the table', () => {
    fixture.detectChanges();

    const filters = fixture.debugElement.query(By.directive(MajorFilters))
      .componentInstance as MajorFilters;
    filters.facultyChange.emit('f1');
    fixture.detectChanges();

    expect(component.selectedFaculty).toBe('f1');
    const table = fixture.debugElement.query(By.directive(MajorTable))
      .componentInstance as MajorTable;
    expect(table.faculty).toBe('f1');
  });

  it('should propagate search text from filters down to the table', () => {
    fixture.detectChanges();

    const filters = fixture.debugElement.query(By.directive(MajorFilters))
      .componentInstance as MajorFilters;
    filters.searchTextChange.emit('science');
    fixture.detectChanges();

    expect(component.searchText).toBe('science');
    const table = fixture.debugElement.query(By.directive(MajorTable))
      .componentInstance as MajorTable;
    expect(table.searchText).toBe('science');
  });
});
