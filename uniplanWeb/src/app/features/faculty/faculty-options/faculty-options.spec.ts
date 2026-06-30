import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { FacultyOptions } from './faculty-options';

describe('FacultyOptions', () => {
  let component: FacultyOptions;
  let fixture: ComponentFixture<FacultyOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyOptions],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultyOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
