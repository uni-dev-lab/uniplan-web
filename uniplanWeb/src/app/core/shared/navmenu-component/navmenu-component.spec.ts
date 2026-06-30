import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { provideRouter } from '@angular/router';

import { NavmenuComponent } from './navmenu-component';

describe('NavmenuComponent', () => {
  let component: NavmenuComponent;
  let fixture: ComponentFixture<NavmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavmenuComponent],
      providers: [
        ...translateTestingProviders,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
