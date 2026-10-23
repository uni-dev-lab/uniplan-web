import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MajorElm} from '../../../core/interfaces/major-elm';
import {MajorFilterOptions} from '../../../core/interfaces/major-filter-options';
import {MajorEditForm} from '../major-edit-form/major-edit-form';
import {MatDialog} from '@angular/material/dialog';
import {MajorDeleteForm} from '../major-delete-form/major-delete-form';
import {MajorService} from '../major-service';
import {FacultyService} from '../../faculty/faculty-service';
import {TranslatePipe} from '@ngx-translate/core';
import {MajorFilterState} from '../../../core/interfaces/major-filter-state';
import {FacultyElm} from '../../../core/interfaces/faculty-elm';

@Component({
  selector: 'app-major-table',
  templateUrl: './major-table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-table.scss',
  imports: [MatTableModule, MatIconModule, MatButtonModule, TranslatePipe],
})
export class MajorTable implements OnInit {
  displayedColumns: string[] = [
    'position',
    'name',
    'faculty',
    'type',
    'subtype',
    'actions',
  ];

  protected dataSource: WritableSignal<MajorElm[]> = signal<MajorElm[]>([]);
  protected facultyMap: WritableSignal<Map<string, string>> = signal(new Map<string, string>());

  public searchText: InputSignal<string> = input<string>('');
  public majorFiltersState: InputSignal<MajorFilterState> = input.required<MajorFilterState>()

  private dialog: MatDialog = inject(MatDialog);
  private service: MajorService = inject(MajorService);
  private facultyService: FacultyService = inject(FacultyService);

  ngOnInit(): void {
    this.loadMajors();
    this.loadFaculties();

    this.service.refreshNeeded.subscribe((): void => {
      this.loadMajors();
      this.loadFaculties();
    });
  }

  private loadMajors(): void {
    this.service.getMajors().subscribe((data: MajorElm[]): void => {
      this.dataSource.set(data);
    });
  }

  private loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((faculties: FacultyElm[]): void => {
      this.facultyMap.set(new Map(faculties.map((f: FacultyElm): [string, string] => [f.id, f.facultyName])));
    });
  }

  protected getFacultyName(id: string): string {
    return this.facultyMap().get(id) || '—';
  }

  get filteredMajors(): MajorElm[] {
    return this.dataSource().filter((major: MajorElm): boolean => {
      const matchesFaculty: boolean = !this.majorFiltersState().selectedFaculty || major.facultyId === this.majorFiltersState().selectedFaculty;
      const matchesType: boolean = !this.majorFiltersState().selectedType || major.courseType === this.majorFiltersState().selectedType;
      const matchesSubtype: boolean =
        !this.majorFiltersState().selectedSubtype || major.courseSubtype === this.majorFiltersState().selectedSubtype;
      const matchesSearch: boolean =
        !this.searchText() ||
        major.majorName.toLowerCase().includes(this.searchText().toLowerCase());

      return matchesFaculty && matchesType && matchesSubtype && matchesSearch;
    });
  }

  protected onEdit(element: MajorElm): void {
    this.dialog.open(MajorEditForm, {
      data: {
        id: element.id,
        majorName: element.majorName,
        facultyId: element.facultyId,
      },
    });
  }

  protected onDelete(element: MajorElm): void {
    this.dialog.open(MajorDeleteForm, {
      data: {
        id: element.id,
        courseId: element.courseId,
        majorName: element.majorName,
        facultyId: element.facultyId,
      },
    });
  }

  public static getFilterOptions(
    data: MajorElm[],
    facultyMap: Map<string, string>
  ): MajorFilterOptions {
    const faculties: {
      id: string,
      name: string
    }[] = [...new Set(data.map((e: MajorElm): string => e.facultyId))].map((id: string): {
      id: string,
      name: string
    } => ({
      id,
      name: facultyMap.get(id) || '—',
    }));

    const types: string[] = [...new Set(data.map((e: MajorElm): string => e.courseType))];
    const subtypes: string[] = [...new Set(data.map((e: MajorElm): string => e.courseSubtype))];

    return { faculties, types, subtypes };
  }
}
