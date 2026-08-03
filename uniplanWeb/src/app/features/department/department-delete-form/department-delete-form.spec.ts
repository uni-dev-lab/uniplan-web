import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from '@ngx-translate/core';

import { DepartmentDeleteForm } from './department-delete-form';
import { DeleteForm } from '../../../core/shared/delete-form/delete-form';
import { API_ENDPOINTS } from '../../../config/endpoints';

const DEPARTMENTS_URL = API_ENDPOINTS.departments;

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe('DepartmentDeleteForm', () => {
  let component: DepartmentDeleteForm;
  let fixture: ComponentFixture<DepartmentDeleteForm>;
  let httpMock: HttpTestingController;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<unknown>>;

  const DATA = { id: 'd1', departmentName: 'Computer Science' };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', [
      'close',
    ]);

    await TestBed.configureTestingModule({
      imports: [DepartmentDeleteForm, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { ...DATA } },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentDeleteForm);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the name of the department being deleted', () => {
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Computer Science');
  });

  it('should DELETE the department and close with true', () => {
    fixture.detectChanges();

    const deleteForm = fixture.debugElement.query(By.directive(DeleteForm))
      .componentInstance as DeleteForm;
    deleteForm.deleteClicked.emit();

    const req = httpMock.expectOne(`${DEPARTMENTS_URL}/${DATA.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
