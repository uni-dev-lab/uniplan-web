import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from '@ngx-translate/core';

import { DepartmentFilters } from './department-filters';
import { InputFilter } from '../../../core/shared/input-filter/input-filter';
import { FiltersForm } from '../../../core/shared/filters-form/filters-form';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe('DepartmentFilters', () => {
  let component: DepartmentFilters;
  let fixture: ComponentFixture<DepartmentFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentFilters],
      providers: [
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should re-emit the inner input-filter search term via searchTextChange', () => {
    const emitted: string[] = [];
    component.searchTextChange.subscribe((value) => emitted.push(value));

    const inputFilter = fixture.debugElement.query(By.directive(InputFilter))
      .componentInstance as InputFilter;
    inputFilter.searchTextChange.emit('mathematics');

    expect(emitted).toEqual(['mathematics']);
  });

  it('should re-emit the faculty selection via facultyChange', () => {
    const emitted: string[] = [];
    component.facultyChange.subscribe((value) => emitted.push(value));

    const filtersForm = fixture.debugElement.query(By.directive(FiltersForm))
      .componentInstance as FiltersForm;
    filtersForm.selectionChange.emit('f1');

    expect(emitted).toEqual(['f1']);
  });
});
