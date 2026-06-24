import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { LectorElm } from '../../../core/interfaces/lector-elm';
import { LectorEditForm } from '../lector-edit-form/lector-edit-form';
import { MatDialog } from '@angular/material/dialog';
import { LectorDeleteForm } from '../lector-delete-form/lector-delete-form';
import { LectorService } from '../lector-service';
import { FacultyService } from '../../faculty/faculty-service';

@Component({
  selector: 'app-lector-table',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './lector-table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lector-table.scss',
})
export class LectorTable implements OnInit {
  displayedColumns: string[] = ['position', 'firstName', 'lastName', 'email', 'faculty', 'actions'];

  dataSource: LectorElm[] = [];
  facultyMap = new Map<string, string>();

  @Input() searchText = '';
  @Input() faculty: string = '';

  constructor(
    private dialog: MatDialog,
    private service: LectorService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    this.loadLectors();
    this.loadFaculties();

    this.service.refreshNeeded.subscribe(() => {
      this.loadLectors();
      this.loadFaculties();
    });
  }

  loadLectors(): void {
    this.service.getLectors().subscribe((data) => {
      this.dataSource = data;
    });
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((faculties) => {
      this.facultyMap = new Map(faculties.map((f) => [f.id, f.facultyName]));
    });
  }

  getFacultyName(id: string): string {
    return this.facultyMap.get(id) || '—';
  }

  get filteredLectors(): LectorElm[] {
    return this.dataSource.filter((lector) => {
      const matchesFaculty = !this.faculty || lector.facultyId === this.faculty;
      const fullName = `${lector.firstName} ${lector.lastName}`.toLowerCase();
      const matchesSearch =
        !this.searchText ||
        fullName.includes(this.searchText.toLowerCase()) ||
        lector.email.toLowerCase().includes(this.searchText.toLowerCase());

      return matchesFaculty && matchesSearch;
    });
  }

  onEdit(element: LectorElm): void {
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

  onDelete(element: LectorElm): void {
    this.dialog.open(LectorDeleteForm, {
      data: {
        id: element.id,
        firstName: element.firstName,
        lastName: element.lastName,
      },
    });
  }

  static getFilterOptions(data: LectorElm[], facultyMap: Map<string, string>) {
    const faculties = [...new Set(data.map((e) => e.facultyId))].map((id) => ({
      id,
      name: facultyMap.get(id) || '—',
    }));

    return { faculties };
  }
}
