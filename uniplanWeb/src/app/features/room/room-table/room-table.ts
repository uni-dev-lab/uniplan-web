import { Component, inject, ChangeDetectionStrategy, DestroyRef, OnInit } from '@angular/core';
import { RoomService } from '../room-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FacultyService } from '../../faculty/faculty-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FacultyNamePipe } from '../../../core/shared/pipes/faculty-name-pipe';

@Component({
  selector: 'app-room-table',
  templateUrl: './room-table.html',
  styleUrl: './room-table.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslatePipe,
    CommonModule,
    FacultyNamePipe
  ],
})

export class RoomTable implements OnInit {
  roomService = inject(RoomService);
  facultyService = inject(FacultyService);
  facultyMap = new Map<string, string>();
  private destroyRef = inject(DestroyRef);

  displayedColumns: string[] = [
    'position',
    'facultyId',
    'roomNumber',
    'actions',
  ];

  data$ = this.roomService.getRooms();

  ngOnInit(): void{
    this.loadFaculties();
  }

  loadFaculties(): void {
    this.facultyService.getFaculties()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((faculties) => {
        this.facultyMap = new Map(faculties.map((f) => [f.id, f.facultyName]));
      });
  }
}
