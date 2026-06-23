import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentOptions } from './department-options';

describe('DepartmentOptions', () => {
  let component: DepartmentOptions;
  let fixture: ComponentFixture<DepartmentOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentOptions],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
