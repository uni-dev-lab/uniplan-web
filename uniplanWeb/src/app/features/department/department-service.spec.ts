import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department-service';

describe('DepartmentService', () => {
  let service: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentService);
  });
});
