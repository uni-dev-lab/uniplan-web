
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';

import {
  ResponsiveFilters,
  ResponsiveFilterValues
} from './responsive-filters';

@Component({
  standalone: true,
  imports: [ResponsiveFilters],
  template: `
    <app-responsive-filters
      [filters]="filters"
      [emptyFilters]="emptyFilters"
      (filtersChange)="onFiltersChange($event)">

      <ng-template #filterFields let-draft let-update="update">
        <button
          type="button"
          class="test-change"
          (click)="update({ search: 'changed' })">
          Change filter
        </button>

        <span class="draft-search">{{ draft.search }}</span>
      </ng-template>

    </app-responsive-filters>
  `
})
class TestHostComponent {
  filters: ResponsiveFilterValues = {
    search: 'initial',
    category: 'all'
  };

  emptyFilters: ResponsiveFilterValues = {
    search: '',
    category: 'all'
  };

  emitted: ResponsiveFilterValues[] = [];

  onFiltersChange(values: ResponsiveFilterValues): void {
    this.emitted.push(values);
    this.filters = { ...values };
  }
}

describe('ResponsiveFilters', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let originalWidthDescriptor: PropertyDescriptor | undefined;

  function setWindowWidth(width: number): void {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: width
    });
  }

  function resizeTo(width: number): void {
    setWindowWidth(width);
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
  }

  function click(selector: string): void {
    const button: HTMLButtonElement | null =
      fixture.nativeElement.querySelector(selector);

    expect(button).not.toBeNull();
    button!.click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    originalWidthDescriptor =
      Object.getOwnPropertyDescriptor(window, 'innerWidth');

    setWindowWidth(1024);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [...translateTestingProviders]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (originalWidthDescriptor) {
      Object.defineProperty(
        window,
        'innerWidth',
        originalWidthDescriptor
      );
    } else {
      Reflect.deleteProperty(window, 'innerWidth');
    }
  });

  it('should create', () => {
    expect(
      fixture.nativeElement.querySelector('app-responsive-filters')
    ).not.toBeNull();
  });

  it('should emit filter changes immediately on desktop', () => {
    click('.test-change');

    expect(host.emitted).toEqual([
      { search: 'changed', category: 'all' }
    ]);
  });

  it('should wait for Apply before emitting on mobile', () => {
    resizeTo(375);

    click('.mobile-filter-toggle');
    click('.test-change');

    expect(host.emitted).toEqual([]);

    click('.apply-button');

    expect(host.emitted).toEqual([
      { search: 'changed', category: 'all' }
    ]);
  });

  it('should emit empty filters when Reset is clicked', () => {
    resizeTo(375);

    click('.mobile-filter-toggle');
    click('.test-change');

    click('.mobile-filter-actions button:not(.apply-button)');

    expect(host.emitted).toEqual([
      { search: '', category: 'all' }
    ]);
  });

  it('should discard draft changes when mobile filters are closed', () => {
    resizeTo(375);

    click('.mobile-filter-toggle');
    click('.test-change');

    click('.mobile-filter-toggle');

    expect(host.emitted).toEqual([]);

    click('.mobile-filter-toggle');

    const draft: HTMLElement =
      fixture.nativeElement.querySelector('.draft-search');

    expect(draft.textContent?.trim()).toBe('initial');
    expect(host.emitted).toEqual([]);
  });
});
