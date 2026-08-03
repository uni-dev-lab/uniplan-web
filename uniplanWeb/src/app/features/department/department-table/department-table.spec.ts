import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from '@ngx-translate/core';

import { DepartmentTable } from './department-table';
import { DepartmentService } from '../department-service';
import { DepartmentEditForm } from '../department-edit-form/department-edit-form';
import { DepartmentDeleteForm } from '../department-delete-form/department-delete-form';
import { API_ENDPOINTS } from '../../../config/endpoints';

const DEPARTMENTS_URL = API_ENDPOINTS.departments;
const FACULTIES_URL = API_ENDPOINTS.faculties;

interface RawDepartment {
  id: string;
  departmentName: string;
  facultyId: string;
}

interface RawFaculty {
  id: string;
  facultyName: string;
  location: string;
  universityId: string;
}

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe('DepartmentTable', () => {
  let component: DepartmentTable;
  let fixture: ComponentFixture<DepartmentTable>;
  let httpMock: HttpTestingController;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const DEPARTMENTS: RawDepartment[] = [
    { id: 'd1', departmentName: 'Computer Science', facultyId: 'f1' },
    { id: 'd2', departmentName: 'Mathematics', facultyId: 'f2' },
  ];

  const FACULTIES: RawFaculty[] = [
    { id: 'f1', facultyName: 'Faculty A', location: 'Sofia', universityId: 'u1' },
    { id: 'f2', facultyName: 'Faculty B', location: 'Plovdiv', universityId: 'u1' },
  ];

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [DepartmentTable, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentTable);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** Answer the department + faculty lookups fired on init / refresh. */
  function flushLoads(
    departments: RawDepartment[] = [],
    faculties: RawFaculty[] = [],
  ): void {
    httpMock.match(DEPARTMENTS_URL).forEach((req) => req.flush(departments));
    httpMock.match(FACULTIES_URL).forEach((req) => req.flush(faculties));
  }

  function rowText(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  function dataRows(): NodeListOf<HTMLTableRowElement> {
    return (fixture.nativeElement as HTMLElement).querySelectorAll('tr[mat-row]');
  }

  it('should create and load its data on init', () => {
    fixture.detectChanges();
    flushLoads();
    expect(component).toBeTruthy();
  });

  it('should render a row per department with its name and resolved faculty name', () => {
    fixture.detectChanges();
    flushLoads(DEPARTMENTS, FACULTIES);
    fixture.detectChanges();

    expect(dataRows().length).toBe(2);
    const text = rowText();
    expect(text).toContain('Computer Science');
    expect(text).toContain('Faculty A');
    expect(text).toContain('Mathematics');
    expect(text).toContain('Faculty B');
  });

  it('should show an em dash for a department whose faculty is unknown', () => {
    fixture.detectChanges();
    flushLoads(
      [{ id: 'd9', departmentName: 'Orphan', facultyId: 'f-missing' }],
      FACULTIES,
    );
    fixture.detectChanges();

    expect(rowText()).toContain('—');
  });

  it('should render no data rows for an empty department list', () => {
    fixture.detectChanges();
    flushLoads([], FACULTIES);
    fixture.detectChanges();

    expect(dataRows().length).toBe(0);
  });

  it('should filter departments by the search term', () => {
    fixture.detectChanges();
    flushLoads(DEPARTMENTS, FACULTIES);

    fixture.componentRef.setInput('searchText', 'comp');
    fixture.detectChanges();

    expect(dataRows().length).toBe(1);
    expect(rowText()).toContain('Computer Science');
    expect(rowText()).not.toContain('Mathematics');
  });

  it('should filter departments by the selected faculty', () => {
    fixture.detectChanges();
    flushLoads(DEPARTMENTS, FACULTIES);

    fixture.componentRef.setInput('faculty', 'f2');
    fixture.detectChanges();

    expect(dataRows().length).toBe(1);
    expect(rowText()).toContain('Mathematics');
    expect(rowText()).not.toContain('Computer Science');
  });

  it('should open the edit dialog with the row data when edit is clicked', () => {
    fixture.detectChanges();
    flushLoads(DEPARTMENTS, FACULTIES);
    fixture.detectChanges();

    const editButton = dataRows()[0].querySelectorAll('button')[0];
    (editButton as HTMLButtonElement).click();

    expect(dialogSpy.open).toHaveBeenCalledWith(DepartmentEditForm, {
      data: { id: 'd1', departmentName: 'Computer Science', facultyId: 'f1' },
    });
  });

  it('should open the delete dialog with the row data when delete is clicked', () => {
    fixture.detectChanges();
    flushLoads(DEPARTMENTS, FACULTIES);
    fixture.detectChanges();

    const deleteButton = dataRows()[0].querySelectorAll('button')[1];
    (deleteButton as HTMLButtonElement).click();

    expect(dialogSpy.open).toHaveBeenCalledWith(DepartmentDeleteForm, {
      data: { id: 'd1', departmentName: 'Computer Science' },
    });
  });

  it('should reload its data when the service fires refreshNeeded', () => {
    fixture.detectChanges();
    flushLoads([DEPARTMENTS[0]], FACULTIES);
    fixture.detectChanges();
    expect(dataRows().length).toBe(1);

    TestBed.inject(DepartmentService).refreshNeeded.next();
    flushLoads(DEPARTMENTS, FACULTIES);
    fixture.detectChanges();
    expect(dataRows().length).toBe(2);
  });

  it('getFilterOptions should dedupe faculties and fall back to an em dash', () => {
    const options = DepartmentTable.getFilterOptions(
      [
        { id: 'd1', departmentName: 'CS', facultyId: 'f1', position: 1 },
        { id: 'd2', departmentName: 'Math', facultyId: 'f1', position: 2 },
        { id: 'd3', departmentName: 'Bio', facultyId: 'f3', position: 3 },
      ],
      new Map([['f1', 'Faculty A']]),
    );

    expect(options.faculties).toEqual([
      { id: 'f1', name: 'Faculty A' },
      { id: 'f3', name: '—' },
    ]);
  });
});
