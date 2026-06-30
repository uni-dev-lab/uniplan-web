
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { FacultyService } from '../faculty-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FacultyEditForm } from '../faculty-edit-form/faculty-edit-form';
import { FacultyDeleteForm } from '../faculty-delete-form/faculty-delete-form';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-faculty-table',
  templateUrl: './faculty-table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faculty-table.scss',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslatePipe
    ],
})
export class FacultyTable {
  displayedColumns: string[] = [
    'position',
    'facultyName',
    'location',
    'actions',
  ];
  dataSource: FacultyElm[] = [];

  constructor(
    private facultyService: FacultyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadFaculties();

    this.facultyService.refreshNeeded.subscribe(() => {
      this.loadFaculties();
    });
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((data) => {
      this.dataSource = data;
    });
  }

  onEdit(element: FacultyElm): void {
    this.dialog.open(FacultyEditForm, {
      data: {
        id: element.id,
        facultyName: element.facultyName,
        location: element.location,
        universityId: element.universityId,
      },
    });
  }

  onDelete(element: FacultyElm): void {
    this.dialog.open(FacultyDeleteForm, {
      data: {
        id: element.id,
        facultyName: element.facultyName,
      },
    });
  }
}
