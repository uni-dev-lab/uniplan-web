import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';

import { StudentTable } from './student-table';

describe('StudentTable', () => {
  let component: StudentTable;
  let fixture: ComponentFixture<StudentTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTable],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
