import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveFilters } from './responsive-filters';

describe('ResponsiveFilters', () => {
  let component: ResponsiveFilters;
  let fixture: ComponentFixture<ResponsiveFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsiveFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
