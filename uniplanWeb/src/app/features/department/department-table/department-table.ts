import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DepartmentElm } from '../../../core/interfaces/department-elm';
import { DepartmentEditForm } from '../department-edit-form/department-edit-form';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentDeleteForm } from '../department-delete-form/department-delete-form';
import { DepartmentService } from '../department-service';
import { FacultyService } from '../../faculty/faculty-service';
import {TranslatePipe} from '@ngx-translate/core';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-department-table',
  imports: [MatTableModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './department-table.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './department-table.scss',
})
export class DepartmentTable implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'faculty', 'actions'];

  dataSource: DepartmentElm[] = [];
  facultyMap = new Map<string, string>();

  readonly searchText = input('');
  readonly faculty = input('');

  constructor(
    private dialog: MatDialog,
    private service: DepartmentService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadFaculties();

    this.service.refreshNeeded.subscribe(() => {
      this.loadDepartments();
      this.loadFaculties();
    });
  }

  private loadDepartments(): void {
    this.service.getDepartments().subscribe((data) => {
      this.dataSource = data;
    });
  }

  private loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((faculties) => {
      this.facultyMap = new Map(faculties.map((f) => [f.id, f.facultyName]));
    });
  }

  protected getFacultyName(id: string): string {
    return this.facultyMap.get(id) || '—';
  }

  protected get filteredDepartments(): DepartmentElm[] {
    const faculty = this.faculty();
    const searchText = this.searchText();

    return this.dataSource.filter((dept) => {
      const matchesFaculty = !faculty || dept.facultyId === faculty;
      const matchesSearch =
        !searchText ||
        dept.departmentName.toLowerCase().includes(searchText.toLowerCase());

      return matchesFaculty && matchesSearch;
    });
  }

  protected onEdit(element: DepartmentElm): void {
    this.dialog.open(DepartmentEditForm, {
      data: {
        id: element.id,
        departmentName: element.departmentName,
        facultyId: element.facultyId,
      },
    });
  }

  protected onDelete(element: DepartmentElm): void {
    this.dialog.open(DepartmentDeleteForm, {
      data: {
        id: element.id,
        departmentName: element.departmentName,
      },
    });
  }

  static getFilterOptions(
    data: DepartmentElm[],
    facultyMap: Map<string, string>,
  ): { faculties: { id: string; name: string }[] } {
    const faculties = [...new Set(data.map((e) => e.facultyId))].map((id) => ({
      id,
      name: facultyMap.get(id) || '—',
    }));

    return { faculties };
  }
}
