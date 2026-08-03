import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

import { DepartmentPanel } from './department-panel';
import { DepartmentFilters } from '../department-filters/department-filters';
import { DepartmentTable } from '../department-table/department-table';
import { API_ENDPOINTS } from '../../../config/endpoints';

const DEPARTMENTS_URL = API_ENDPOINTS.departments;
const FACULTIES_URL = API_ENDPOINTS.faculties;

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe('DepartmentPanel', () => {
  let component: DepartmentPanel;
  let fixture: ComponentFixture<DepartmentPanel>;
  let httpMock: HttpTestingController;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [DepartmentPanel, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentPanel);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** The panel and its child table each load faculties and departments on init. */
  function flushInitialRequests(): void {
    httpMock.match(FACULTIES_URL).forEach((req) =>
      req.flush([
        { id: 'f1', facultyName: 'Faculty A', location: 'Sofia', universityId: 'u1' },
      ]),
    );
    httpMock.match(DEPARTMENTS_URL).forEach((req) =>
      req.flush([
        { id: 'd1', departmentName: 'Computer Science', facultyId: 'f1' },
      ]),
    );
  }

  it('should create', () => {
    fixture.detectChanges();
    flushInitialRequests();
    expect(component).toBeTruthy();
  });

  it('should render the department options, filters and table', () => {
    fixture.detectChanges();
    flushInitialRequests();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-department-options')).toBeTruthy();
    expect(el.querySelector('app-department-filters')).toBeTruthy();
    expect(el.querySelector('app-department-table')).toBeTruthy();
  });

  it('should derive the faculty filter options from the loaded data', () => {
    fixture.detectChanges();
    flushInitialRequests();

    expect(component.faculties).toEqual([{ id: 'f1', name: 'Faculty A' }]);
  });

  it('should propagate the search term from the filters down to the table', () => {
    fixture.detectChanges();
    flushInitialRequests();

    const filters = fixture.debugElement.query(By.directive(DepartmentFilters))
      .componentInstance as DepartmentFilters;
    filters.searchTextChange.emit('math');
    fixture.detectChanges();

    expect(component.searchText).toBe('math');
    const table = fixture.debugElement.query(By.directive(DepartmentTable))
      .componentInstance as DepartmentTable;
    expect(table.searchText()).toBe('math');
  });

  it('should propagate the selected faculty from the filters down to the table', () => {
    fixture.detectChanges();
    flushInitialRequests();

    const filters = fixture.debugElement.query(By.directive(DepartmentFilters))
      .componentInstance as DepartmentFilters;
    filters.facultyChange.emit('f1');
    fixture.detectChanges();

    expect(component.selectedFaculty).toBe('f1');
    const table = fixture.debugElement.query(By.directive(DepartmentTable))
      .componentInstance as DepartmentTable;
    expect(table.faculty()).toBe('f1');
  });
});
