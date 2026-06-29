import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RoomService } from '../room-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FacultyService } from '../../faculty/faculty-service';

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
    CommonModule
  ],
})

export class RoomTable {
  roomService = inject(RoomService);
  facultyService = inject(FacultyService);
  facultyMap = new Map<string, string>();

  displayedColumns: string[] = [
    'position',
    'facultyId',
    'roomNumber',
    'actions',
  ];

  data$ = this.roomService.getRooms();

   constructor() {
    this.loadFaculties();
  }
  
  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((faculties) => {
      this.facultyMap = new Map(faculties.map((f) => [f.id, f.facultyName]));
    });
  }

  getFacultyName(id: string): string {
    return this.facultyMap.get(id) || '—';
  }
}
