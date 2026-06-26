import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { MajorOptions } from './major-options';

describe('MajorOptions', () => {
  let component: MajorOptions;
  let fixture: ComponentFixture<MajorOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorOptions],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MajorOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
