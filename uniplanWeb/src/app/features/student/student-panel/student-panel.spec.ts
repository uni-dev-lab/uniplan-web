import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { translateTestingProviders } from '@testing/translate-testing';

import { StudentPanel } from './student-panel';
import { StudentFilters } from '../student-filters/student-filters';
import { StudentTable } from '../student-table/student-table';

describe('StudentPanel', () => {
  let component: StudentPanel;
  let fixture: ComponentFixture<StudentPanel>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [StudentPanel],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialog, useValue: dialogSpy },
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
    expect(names).toEqual(['Иван Иванов']);
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
