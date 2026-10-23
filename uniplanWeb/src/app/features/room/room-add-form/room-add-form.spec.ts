import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomAddForm } from './room-add-form';
import { translateTestingProviders } from '@testing/translate-testing';
import { MatDialogRef } from '@angular/material/dialog';

describe('RoomAddForm', () => {
  let component: RoomAddForm;
  let fixture: ComponentFixture<RoomAddForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomAddForm],
      providers: [
        ...translateTestingProviders,
        { provide: MatDialogRef, useValue: {} },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RoomAddForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
