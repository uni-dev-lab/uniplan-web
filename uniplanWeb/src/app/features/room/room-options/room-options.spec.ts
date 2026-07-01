import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomOptions } from './room-options';

describe('RoomOptions', () => {
  let component: RoomOptions;
  let fixture: ComponentFixture<RoomOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
