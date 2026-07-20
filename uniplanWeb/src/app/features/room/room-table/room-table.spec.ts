import { ComponentFixture, TestBed } from '@angular/core/testing';
import { translateTestingProviders } from '@testing/translate-testing';
import { RoomTable } from './room-table';

describe('RoomTable', () => {
  let component: RoomTable;
  let fixture: ComponentFixture<RoomTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomTable],
      providers: [...translateTestingProviders]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RoomTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
