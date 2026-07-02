import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditForm } from './student-edit-form';

describe('StudentEditForm', () => {
  let component: StudentEditForm;
  let fixture: ComponentFixture<StudentEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEditForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
