import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentFilters } from './department-filters';

describe('DepartmentFilters', () => {
  let component: DepartmentFilters;
  let fixture: ComponentFixture<DepartmentFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
