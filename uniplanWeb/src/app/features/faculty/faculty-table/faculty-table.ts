import {ChangeDetectionStrategy, Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {FacultyElm} from '../../../core/interfaces/faculty-elm';
import {FacultyService} from '../faculty-service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FacultyEdit} from '../faculty-edit/faculty-edit';
import {FacultyDeleteForm} from '../faculty-delete-form/faculty-delete-form';
import {TranslatePipe} from '@ngx-translate/core';

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
export class FacultyTable implements OnInit{

  protected displayedColumns: string[] = [
    'position',
    'facultyName',
    'location',
    'actions',
  ];

  private readonly _dataSource: WritableSignal<FacultyElm[]> = signal<FacultyElm[]>([]);
  protected dataSource: Signal<FacultyElm[]> = this._dataSource.asReadonly();

  private readonly facultyService: FacultyService = inject(FacultyService);
  private readonly dialog: MatDialog = inject(MatDialog);

  public ngOnInit(): void {
    this.loadFaculties();

    this.facultyService.refreshNeeded.subscribe((): void => {
      this.loadFaculties();
    });
  }

  private loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((data: FacultyElm[]): void => {
      this._dataSource.set(data);
    });
  }

  protected onEdit(element: FacultyElm): void {
    this.dialog.open(FacultyEdit, {
      data: {
        id: element.id,
        facultyName: element.facultyName,
        location: element.location,
        universityId: element.universityId,
      },
    });
  }

  protected onDelete(element: FacultyElm): void {
    this.dialog.open(FacultyDeleteForm, {
      data: {
        id: element.id,
        facultyName: element.facultyName,
      },
    });
  }
}
