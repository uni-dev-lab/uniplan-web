import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';

import { EditForm } from './edit-form';

describe('EditForm', () => {
  let component: EditForm;
  let fixture: ComponentFixture<EditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditForm],
      providers: [
        ...translateTestingProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
