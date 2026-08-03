import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from '@ngx-translate/core';

import { DepartmentEditForm } from './department-edit-form';
import { EditForm } from '../../../core/shared/edit-form/edit-form';
import { API_ENDPOINTS } from '../../../config/endpoints';

const DEPARTMENTS_URL = API_ENDPOINTS.departments;
const FACULTIES_URL = API_ENDPOINTS.faculties;

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe('DepartmentEditForm', () => {
  let component: DepartmentEditForm;
  let fixture: ComponentFixture<DepartmentEditForm>;
  let httpMock: HttpTestingController;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<unknown>>;

  const DATA = { id: 'd1', departmentName: 'Computer Science', facultyId: 'f1' };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', [
      'close',
    ]);

    await TestBed.configureTestingModule({
      imports: [DepartmentEditForm, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { ...DATA } },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentEditForm);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function init(): void {
    fixture.detectChanges();
    httpMock.expectOne(FACULTIES_URL).flush([]);
  }

  function saveViaChildForm(): void {
    const editForm = fixture.debugElement.query(By.directive(EditForm))
      .componentInstance as EditForm;
    editForm.saveClicked.emit();
  }

  function reactiveForm(): FormGroup {
    return (component as unknown as { form: FormGroup }).form;
  }

  it('should create', () => {
    init();
    expect(component).toBeTruthy();
  });

  it('should prefill the form from the injected dialog data', () => {
    init();
    expect(reactiveForm().value).toEqual({
      departmentName: 'Computer Science',
      facultyId: 'f1',
    });
  });

  it('should not submit when a required field is cleared', () => {
    init();
    reactiveForm().setValue({ departmentName: '', facultyId: 'f1' });
    saveViaChildForm();

    httpMock.expectNone(`${DEPARTMENTS_URL}/${DATA.id}`);
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should PUT the edited department and close with true', () => {
    init();
    reactiveForm().setValue({ departmentName: 'CS II', facultyId: 'f2' });
    saveViaChildForm();

    const req = httpMock.expectOne(`${DEPARTMENTS_URL}/${DATA.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ departmentName: 'CS II', facultyId: 'f2' });
    req.flush({});

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
