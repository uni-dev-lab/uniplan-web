import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDeleteForm } from './department-delete-form';

describe('DepartmentDeleteForm', () => {
  let component: DepartmentDeleteForm;
  let fixture: ComponentFixture<DepartmentDeleteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDeleteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentDeleteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
