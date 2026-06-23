import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAddForm } from './department-add-form';

describe('DepartmentAddForm', () => {
  let component: DepartmentAddForm;
  let fixture: ComponentFixture<DepartmentAddForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentAddForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentAddForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
