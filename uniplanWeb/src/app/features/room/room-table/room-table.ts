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
import { FacultyNamePipe } from '../../../core/shared/pipes/faculty/faculty-name-pipe';
import { CategoryDisplayPipe } from '../../../core/shared/pipes/category/category-display-pipe';
import { CategoryService } from '../../../services/category/category-service';

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
    FacultyNamePipe,
    CategoryDisplayPipe
  ],
})

export class RoomTable implements OnInit {
  roomService = inject(RoomService);
  facultyService = inject(FacultyService);
  categoryService = inject(CategoryService)
  facultyMap = new Map<string, string>();
  categoryMap = new Map<string, string>();
  private destroyRef = inject(DestroyRef);

  displayedColumns: string[] = [
    'position',
    'facultyId',
    'roomNumber',
    'categoryId',
    'actions',
  ];

  ngOnInit(): void {
    this.loadFaculties();
    this.loadCategories();
  }

  data$ = this.roomService.getRooms();

  loadFaculties(): void {
    this.facultyService.getFaculties()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((faculties) => {
        this.facultyMap = new Map(faculties.map((f) => [f.id, f.facultyName]));
      });
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => {
        this.categoryMap = new Map(
          categories.map((c) => [c.id, `${c.roomType} (${c.capacity})`])
        );
      });
  }
}
