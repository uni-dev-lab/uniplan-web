import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lector } from './lector';

describe('Lector', () => {
  let component: Lector;
  let fixture: ComponentFixture<Lector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
