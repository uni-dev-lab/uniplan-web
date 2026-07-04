import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { translateTestingProviders } from '@testing/translate-testing';

import { NotFoundPanel } from './not-found-panel';

describe('NotFoundPanel', () => {
  let component: NotFoundPanel;
  let fixture: ComponentFixture<NotFoundPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPanel],
      providers: [
        provideRouter([]),
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a link back to home', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/home');
  });
});
