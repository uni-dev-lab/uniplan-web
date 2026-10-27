import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {Lector} from '../../../core/interfaces/lector';
import {LectorEditForm} from '../lector-edit-form/lector-edit-form';
import {MatDialog} from '@angular/material/dialog';
import {LectorDeleteForm} from '../lector-delete-form/lector-delete-form';
import {LectorService} from '../lector-service';
import {FacultyService} from '../../faculty/faculty-service';
import {TranslatePipe} from '@ngx-translate/core';
import {FacultyElm} from '../../../core/interfaces/faculty-elm';

@Component({
  selector: 'app-lector-table',
  templateUrl: './lector-table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-table.scss',
  imports: [MatTableModule, MatIconModule, MatButtonModule, TranslatePipe],
})
export class LectorTable implements OnInit {
  protected displayedColumns: string[] = ['position', 'firstName', 'lastName', 'email', 'faculty', 'actions'];

  private readonly _dataSource: WritableSignal<Lector[]> = signal<Lector[]>([]);

  private facultyMap: Map<string, string> = new Map<string, string>();

  public searchText: InputSignal<string> = input<string>('');
  public faculty: InputSignal<string> = input<string>('');

  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly service: LectorService = inject(LectorService);
  private readonly facultyService: FacultyService = inject(FacultyService);

  public ngOnInit(): void {
    this.loadLectors();
    this.loadFaculties();

    this.service.refreshNeeded.subscribe(():void => {
      this.loadLectors();
      this.loadFaculties();
    });
  }

  private loadLectors(): void {
    this.service.getLectors().subscribe((data: Lector[]): void => {
      this._dataSource.set(data);
    });
  }

  private loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((faculties: FacultyElm[]): void => {
      this.facultyMap = new Map(faculties.map((f: FacultyElm): [string, string] => [f.id, f.facultyName]));
    });
  }

  protected getFacultyName(id: string): string {
    return this.facultyMap.get(id) || '—';
  }

  protected filteredLectors:Signal<Lector[]> = computed(():Lector[] => {
    const faculty:string = this.faculty();
    const searchText:string = this.searchText().toLowerCase();

    return this._dataSource().filter((lector:Lector):boolean => {
      const matchesFaculty:boolean = !faculty || lector.facultyId === faculty;
      const fullName:string = `${lector.firstName} ${lector.lastName}`.toLowerCase();
      const matchesSearch:boolean =
        !searchText ||
        fullName.includes(searchText) ||
        lector.email.toLowerCase().includes(searchText);
      return matchesFaculty && matchesSearch;
    });
  })

  protected onEdit(element: Lector): void {
    this.dialog.open(LectorEditForm, {
      data: {
        id: element.id,
        firstName: element.firstName,
        lastName: element.lastName,
        email: element.email,
        facultyId: element.facultyId,
      },
    });
  }

  protected onDelete(element: Lector): void {
    this.dialog.open(LectorDeleteForm, {
      data: {
        id: element.id,
        firstName: element.firstName,
        lastName: element.lastName,
      },
    });
  }

  protected static getFilterOptions(
    data: Lector[],
    facultyMap: Map<string, string>,
  ): { faculties: { id: string; name: string }[] } {
    const faculties:{id:string, name:string}[] = [...new Set(data.map((e:Lector):string => e.facultyId))].map((id:string):{id:string, name:string} => ({
      id,
      name: facultyMap.get(id) || '—',
    }));

    return { faculties };
  }
}
