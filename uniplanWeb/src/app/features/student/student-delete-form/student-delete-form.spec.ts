import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../student-service';
import { StudentDeleteForm } from './student-delete-form';

describe('StudentDeleteForm', () => {
  let component: StudentDeleteForm;
  let fixture: ComponentFixture<StudentDeleteForm>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  beforeEach(async () => {
    studentServiceSpy = jasmine.createSpyObj('StudentService', ['deleteStudent']);

    await TestBed.configureTestingModule({
      imports: [StudentDeleteForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { id: '1', name: 'Test Student', facultyNumber: '12345' } },
        { provide: StudentService, useValue: studentServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDeleteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});