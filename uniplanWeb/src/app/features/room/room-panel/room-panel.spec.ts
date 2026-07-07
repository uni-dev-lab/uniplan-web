import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomPanel } from './room-panel';
import { translateTestingProviders } from '@testing/translate-testing';

describe('RoomPanel', () => {
  let component: RoomPanel;
  let fixture: ComponentFixture<RoomPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomPanel],
      providers: [
        ...translateTestingProviders,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
