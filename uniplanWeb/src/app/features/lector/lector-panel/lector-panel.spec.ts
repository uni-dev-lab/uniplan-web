import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';

import { LectorPanel } from './lector-panel';
import { LectorFilters } from '../lector-filters/lector-filters';
import { LectorTable } from '../lector-table/lector-table';
import { API_ENDPOINTS } from '../../../config/endpoints';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

describe('LectorPanel', () => {
  let component: LectorPanel;
  let fixture: ComponentFixture<LectorPanel>;
  let httpMock: HttpTestingController;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const FACULTIES_URL = API_ENDPOINTS.faculties;
  const LECTORS_URL = API_ENDPOINTS.lectors;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [LectorPanel, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LectorPanel);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  /** Flush the HTTP requests fired by the panel and its child table on init. */
  function flushInitialRequests(): void {
    httpMock.match(FACULTIES_URL).forEach((req) =>
      req.flush([
        {
          id: 'f1',
          facultyName: 'Faculty A',
          location: 'Sofia',
          universityId: 'u1',
        },
      ]),
    );
    httpMock.match(LECTORS_URL).forEach((req) =>
      req.flush([
        {
          id: 'l1',
          firstName: 'Иван',
          lastName: 'Иванов',
          email: 'ivan@example.com',
          facultyId: 'f1',
        },
      ]),
    );
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    flushInitialRequests();
    expect(component).toBeTruthy();
  });

  it('should derive the faculty filter options from the faculty data on init', () => {
    fixture.detectChanges();
    flushInitialRequests();
    expect(component.lectorFaculties).toEqual([{ id: 'f1', name: 'Faculty A' }]);
  });

  it('should render the lector options, filters and table', () => {
    fixture.detectChanges();
    flushInitialRequests();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-lector-options')).toBeTruthy();
    expect(compiled.querySelector('app-lector-filters')).toBeTruthy();
    expect(compiled.querySelector('app-lector-table')).toBeTruthy();
  });

  it('should propagate a search term from the filters down to the table', () => {
    fixture.detectChanges();
    flushInitialRequests();

    const filters = fixture.debugElement.query(By.directive(LectorFilters))
      .componentInstance as LectorFilters;
    filters.searchTextChange.emit('ivan');
    fixture.detectChanges();

    expect(component.lectorSearchText).toBe('ivan');
    const table = fixture.debugElement.query(By.directive(LectorTable))
      .componentInstance as LectorTable;
    expect(table.searchText()).toBe('ivan');
  });

  it('should propagate the selected faculty from the filters down to the table', () => {
    fixture.detectChanges();
    flushInitialRequests();

    const filters = fixture.debugElement.query(By.directive(LectorFilters))
      .componentInstance as LectorFilters;
    filters.facultyChange.emit('f1');
    fixture.detectChanges();

    expect(component.selectedLectorFaculty).toBe('f1');
    const table = fixture.debugElement.query(By.directive(LectorTable))
      .componentInstance as LectorTable;
    expect(table.faculty()).toBe('f1');
  });
});
