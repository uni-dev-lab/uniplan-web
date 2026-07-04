import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { FacultyTable } from './faculty-table';

describe('FacultyTable', () => {
  let component: FacultyTable;
  let fixture: ComponentFixture<FacultyTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyTable],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultyTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
