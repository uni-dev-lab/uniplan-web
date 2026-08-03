import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from '@ngx-translate/core';

import { DepartmentOptions } from './department-options';
import { DepartmentAddForm } from '../department-add-form/department-add-form';
import { AddButton } from '../../../core/shared/add-button/add-button';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe('DepartmentOptions', () => {
  let component: DepartmentOptions;
  let fixture: ComponentFixture<DepartmentOptions>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [DepartmentOptions],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the add-department dialog at 400px when the add button emits', () => {
    const addButton = fixture.debugElement.query(By.directive(AddButton))
      .componentInstance as AddButton;
    addButton.addClicked.emit();

    expect(dialogSpy.open).toHaveBeenCalledWith(DepartmentAddForm, {
      width: '400px',
    });
  });
});
