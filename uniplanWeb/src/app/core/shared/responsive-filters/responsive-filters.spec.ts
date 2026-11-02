import { ComponentFixture, TestBed } from '@angular/core/testing';
import {translateTestingProviders} from '@testing/translate-testing';

import { ResponsiveFilters } from './responsive-filters';

describe('ResponsiveFilters', () => {
  let component: ResponsiveFilters;
  let fixture: ComponentFixture<ResponsiveFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveFilters],
      providers: [...translateTestingProviders]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsiveFilters);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('filters', {});
    fixture.componentRef.setInput('emptyFilters', {});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
