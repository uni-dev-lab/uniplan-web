import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';

import { StudentFilters } from './student-filters';

describe('StudentFilters', () => {
  let component: StudentFilters;
  let fixture: ComponentFixture<StudentFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFilters],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
