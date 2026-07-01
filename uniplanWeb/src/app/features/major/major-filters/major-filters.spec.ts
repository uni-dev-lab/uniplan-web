import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MajorFilters } from './major-filters';

describe('MajorFilters', () => {
  let component: MajorFilters;
  let fixture: ComponentFixture<MajorFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorFilters],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MajorFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
