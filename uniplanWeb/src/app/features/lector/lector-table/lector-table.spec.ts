import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';

import { LectorTable } from './lector-table';

describe('LectorTable', () => {
  let component: LectorTable;
  let fixture: ComponentFixture<LectorTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectorTable, HttpClientTestingModule],
      providers: [
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj('MatDialog', ['open']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LectorTable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
