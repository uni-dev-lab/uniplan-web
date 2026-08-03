import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from '@ngx-translate/core';

import { DepartmentAddForm } from './department-add-form';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { API_ENDPOINTS } from '../../../config/endpoints';

const DEPARTMENTS_URL = API_ENDPOINTS.departments;
const FACULTIES_URL = API_ENDPOINTS.faculties;

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe('DepartmentAddForm', () => {
  let component: DepartmentAddForm;
  let fixture: ComponentFixture<DepartmentAddForm>;
  let httpMock: HttpTestingController;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<unknown>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', [
      'close',
    ]);

    await TestBed.configureTestingModule({
      imports: [DepartmentAddForm, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentAddForm);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** Trigger ngOnInit and answer the faculty lookup for the select. */
  function init(): void {
    fixture.detectChanges();
    httpMock.expectOne(FACULTIES_URL).flush([]);
  }

  function saveViaChildForm(): void {
    const addForm = fixture.debugElement.query(By.directive(AddForm))
      .componentInstance as AddForm;
    addForm.saveClicked.emit();
  }

  function reactiveForm(): FormGroup {
    return (component as unknown as { form: FormGroup }).form;
  }

  it('should create', () => {
    init();
    expect(component).toBeTruthy();
  });

  it('should not submit an empty (invalid) form', () => {
    init();
    saveViaChildForm();

    httpMock.expectNone(DEPARTMENTS_URL);
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should POST the department and close with true on a valid save', () => {
    init();
    reactiveForm().setValue({ departmentName: 'Physics', facultyId: 'f1' });
    saveViaChildForm();

    const req = httpMock.expectOne(DEPARTMENTS_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      departmentName: 'Physics',
      facultyId: 'f1',
    });
    req.flush({});

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
