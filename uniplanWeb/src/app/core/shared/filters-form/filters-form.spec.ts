import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';

import { FiltersForm } from './filters-form';

describe('FiltersForm', () => {
  let component: FiltersForm;
  let fixture: ComponentFixture<FiltersForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersForm],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
