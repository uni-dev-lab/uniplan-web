import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';

import { AddForm } from './add-form';

describe('AddForm', () => {
  let component: AddForm;
  let fixture: ComponentFixture<AddForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddForm],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
