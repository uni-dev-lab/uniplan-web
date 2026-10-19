import {ChangeDetectionStrategy, Component, inject, input, InputSignal, OnInit, signal} from '@angular/core';
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

  dataSource = signal<MajorElm[]>([]);
  facultyMap = signal(new Map<string, string>());

  public searchText: InputSignal<string> = input<string>('');
  public majorFiltersState: InputSignal<MajorFilterState> = input.required<MajorFilterState>()

    private dialog = inject(MatDialog);
    private service = inject(MajorService);
    private facultyService = inject(FacultyService);

  ngOnInit(): void {
    this.loadMajors();
    this.loadFaculties();

    this.service.refreshNeeded.subscribe(() => {
      this.loadMajors();
      this.loadFaculties();
    });
  }

  loadMajors(): void {
    this.service.getMajors().subscribe((data) => {
      this.dataSource.set(data);
    });
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((faculties) => {
     this.facultyMap.set(new Map(faculties.map((f) => [f.id, f.facultyName])));
    });
  }

  getFacultyName(id: string): string {
    return this.facultyMap().get(id) || '—';
  }

  get filteredMajors(): MajorElm[] {
    return this.dataSource().filter((major) => {
      const matchesFaculty = !this.majorFiltersState().selectedFaculty || major.facultyId === this.majorFiltersState().selectedFaculty;
      const matchesType = !this.majorFiltersState().selectedType || major.courseType === this.majorFiltersState().selectedType;
      const matchesSubtype =
        !this.majorFiltersState().selectedSubtype || major.courseSubtype === this.majorFiltersState().selectedSubtype;
      const matchesSearch =
        !this.searchText() ||
        major.majorName.toLowerCase().includes(this.searchText().toLowerCase());

      return matchesFaculty && matchesType && matchesSubtype && matchesSearch;
    });
  }

  onEdit(element: MajorElm): void {
    this.dialog.open(MajorEditForm, {
      data: {
        id: element.id,
        majorName: element.majorName,
        facultyId: element.facultyId,
      },
    });
  }

  onDelete(element: MajorElm): void {
    this.dialog.open(MajorDeleteForm, {
      data: {
        id: element.id,
        courseId: element.courseId,
        majorName: element.majorName,
        facultyId: element.facultyId,
      },
    });
  }

  static getFilterOptions(
    data: MajorElm[],
    facultyMap: Map<string, string>
  ): MajorFilterOptions {
    const faculties = [...new Set(data.map((e) => e.facultyId))].map((id) => ({
      id,
      name: facultyMap.get(id) || '—',
    }));

    const types = [...new Set(data.map((e) => e.courseType))];
    const subtypes = [...new Set(data.map((e) => e.courseSubtype))];

    return { faculties, types, subtypes };
  }
}
