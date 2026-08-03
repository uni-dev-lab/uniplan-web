import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { DepartmentService } from './department-service';
import { DepartmentElm } from '../../core/interfaces/department-elm';
import { API_ENDPOINTS } from '../../config/endpoints';

const DEPARTMENTS_URL = API_ENDPOINTS.departments;

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DepartmentService],
    });
    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET the departments and assign a 1-based position to each', () => {
    let result: DepartmentElm[] | undefined;
    service.getDepartments().subscribe((departments) => (result = departments));

    const req = httpMock.expectOne(DEPARTMENTS_URL);
    expect(req.request.method).toBe('GET');
    req.flush([
      { id: 'd1', departmentName: 'Computer Science', facultyId: 'f1' },
      { id: 'd2', departmentName: 'Mathematics', facultyId: 'f2' },
    ]);

    expect(result?.length).toBe(2);
    expect(result?.[0]).toEqual({
      id: 'd1',
      departmentName: 'Computer Science',
      facultyId: 'f1',
      position: 1,
    });
    expect(result?.[1].position).toBe(2);
  });

  it('should return an empty list when there are no departments', () => {
    let result: DepartmentElm[] | undefined;
    service.getDepartments().subscribe((departments) => (result = departments));

    httpMock.expectOne(DEPARTMENTS_URL).flush([]);

    expect(result).toEqual([]);
  });

  it('should POST a new department and fire refreshNeeded on the response', () => {
    const refreshSpy = jasmine.createSpy('refresh');
    service.refreshNeeded.subscribe(refreshSpy);

    const payload = { departmentName: 'Physics', facultyId: 'f1' };
    service.createDepartment(payload).subscribe();

    const req = httpMock.expectOne(DEPARTMENTS_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});

    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });

  it('should PUT an edited department to /{id} and fire refreshNeeded', () => {
    const refreshSpy = jasmine.createSpy('refresh');
    service.refreshNeeded.subscribe(refreshSpy);

    service
      .editDepartment('d1', { departmentName: 'CS II', facultyId: 'f2' })
      .subscribe();

    const req = httpMock.expectOne(`${DEPARTMENTS_URL}/d1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ departmentName: 'CS II', facultyId: 'f2' });
    req.flush({});

    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });

  it('should DELETE a department by id and fire refreshNeeded', () => {
    const refreshSpy = jasmine.createSpy('refresh');
    service.refreshNeeded.subscribe(refreshSpy);

    service.deleteDepartment('d1').subscribe();

    const req = httpMock.expectOne(`${DEPARTMENTS_URL}/d1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });

  it('should not fire refreshNeeded until the mutation response arrives', () => {
    const refreshSpy = jasmine.createSpy('refresh');
    service.refreshNeeded.subscribe(refreshSpy);

    service.deleteDepartment('d1').subscribe();
    expect(refreshSpy).not.toHaveBeenCalled();

    httpMock.expectOne(`${DEPARTMENTS_URL}/d1`).flush(null);
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });
});
