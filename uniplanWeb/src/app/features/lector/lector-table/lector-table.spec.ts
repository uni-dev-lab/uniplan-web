import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorTable } from './lector-table';

describe('LectorTable', () => {
  let component: LectorTable;
  let fixture: ComponentFixture<LectorTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectorTable],
    }).compileComponents();

    fixture = TestBed.createComponent(LectorTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
