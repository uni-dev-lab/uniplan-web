import {
  Component,
  computed,
  contentChild,
  Signal,
  TemplateRef,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  effect,
  WritableSignal
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {HostListener} from '@angular/core';

export type ResponsiveFilterValues = Record<string, string>;

@Component({
  selector: 'app-responsive-filters',
  imports: [NgTemplateOutlet, TranslatePipe],
  templateUrl: './responsive-filters.html',
  styleUrl: './responsive-filters.scss',
})
export class ResponsiveFilters {
  public readonly filters: InputSignal<ResponsiveFilterValues> = input.required<ResponsiveFilterValues>();
  public readonly emptyFilters: InputSignal<ResponsiveFilterValues> = input.required<ResponsiveFilterValues>();

  public readonly filtersChange: OutputEmitterRef<ResponsiveFilterValues> = output<ResponsiveFilterValues>();

  public readonly filterTemplate: Signal<TemplateRef<unknown> | undefined> = contentChild<TemplateRef<unknown>>('filterFields');
  public readonly templateContext: Signal<{
    $implicit: ResponsiveFilterValues; update: (change: ResponsiveFilterValues) => void;
  }> = computed((): {
    $implicit: ResponsiveFilterValues; update: (change: ResponsiveFilterValues) => void;
  } => ({
    $implicit: this.draftFilters(), update: (change: ResponsiveFilterValues): void => this.updateDraft(change)
  }));

  protected readonly isOpen: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly isMobile: WritableSignal<boolean> = signal<boolean>(typeof window !== 'undefined' && window.innerWidth <= 768);

  protected readonly draftFilters: WritableSignal<ResponsiveFilterValues> = signal<ResponsiveFilterValues>({});

  constructor() {
    effect((): void => {
      const applied: ResponsiveFilterValues = this.filters();

      if (!this.isMobile() || !this.isOpen()) {
        this.draftFilters.set({ ...applied });
      }
    });
  }

  protected updateDraft(change: ResponsiveFilterValues): void {
    this.draftFilters.update((current: ResponsiveFilterValues): ResponsiveFilterValues => ({
      ...current, ...change
    }));

    if (!this.isMobile()) {
      this.apply();
    }
  }

  protected apply(): void {
    this.filtersChange.emit({...this.draftFilters()});
    this.isOpen.set(false);
  }

  protected reset(): void {
    this.draftFilters.set({...this.emptyFilters()});
    this.apply();
  }

  protected cancel(): void {
    this.draftFilters.set({...this.filters()});
    this.isOpen.set(false);
  }

  protected toggle(): void {
    if (this.isOpen()) {
      this.cancel();
      return;
    }

    this.draftFilters.set({ ...this.filters() });
    this.isOpen.set(true);
  }

  @HostListener('window:resize')
  protected onResize(): void {
    const isNowMobile: boolean = window.innerWidth <= 768;
    const wasMobile: boolean = this.isMobile();

    if (wasMobile === isNowMobile) {
      return;
    }

    this.isMobile.set(isNowMobile);

    if (wasMobile && !isNowMobile && this.isOpen()) {
      this.apply();
    }
  }
}
