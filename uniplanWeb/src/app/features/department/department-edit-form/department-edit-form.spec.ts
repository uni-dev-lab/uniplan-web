import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentEditForm } from './department-edit-form';

describe('DepartmentEditForm', () => {
  let component: DepartmentEditForm;
  let fixture: ComponentFixture<DepartmentEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentEditForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentEditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
