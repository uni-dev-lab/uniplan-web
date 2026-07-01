import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAddForm } from './room-add-form';

describe('RoomAddForm', () => {
  let component: RoomAddForm;
  let fixture: ComponentFixture<RoomAddForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomAddForm]
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
