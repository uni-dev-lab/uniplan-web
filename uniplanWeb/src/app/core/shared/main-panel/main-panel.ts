import { Component, ChangeDetectionStrategy } from '@angular/core';

import { FacultyOptions } from '../../../features/faculty/faculty-options/faculty-options';
import { ViewService } from './view.service';
import { MajorOptions } from '../../../features/major/major-options/major-options';
import { FacultyTable } from '../../../features/faculty/faculty-table/faculty-table';
import { MajorTable } from '../../../features/major/major-table/major-table';
import { MajorFilters } from '../../../features/major/major-filters/major-filters';
import { StudentOptions } from '../../../features/student/student-options/student-options';
import {
  StudentTable,
  ELEMENT_STUDENT_DATA,
} from '../../../features/student/student-table/student-table';
import { StudentFilters } from '../../../features/student/student-filters/student-filters';
import { MajorElm } from '../../interfaces/major-elm';
import { MajorService } from '../../../features/major/major-service';
import { FacultyService } from '../../../features/faculty/faculty-service';
import {StudentElm} from '../../interfaces/student-elm';
import {FacultyElm} from '../../interfaces/faculty-elm';

@Component({
  selector: 'app-main-panel',
  imports: [
    FacultyOptions,
    MajorOptions,
    FacultyTable,
    MajorTable,
    MajorFilters,
    StudentOptions,
    StudentTable,
    StudentFilters
],
  standalone: true,
  templateUrl: './main-panel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-panel.scss',
})
export class MainPanel {
  protected currentView: string = 'home';

  protected majors: MajorElm[] = [];
  protected students: StudentElm[] = ELEMENT_STUDENT_DATA;

  protected searchText: string = '';
  protected searchFacNum: string = '';
  protected searchMajor: string = '';
  protected selectedStudentSubtype: string = '';
  protected studentSubtypes: string[] = [];

  protected selectedFaculty: string = '';
  protected selectedType: string = '';
  protected selectedSubtype: string = '';

  protected faculties: { id: string; name: string }[] = [];
  protected types: string[] = [];
  protected subtypes: string[] = [];

  private facultyMap: Map<string, string> = new Map<string, string>();

  public constructor(
    private viewService: ViewService,
    private majorService: MajorService,
    private facultyService: FacultyService
  ) {
    this.viewService.currentView$.subscribe((view: string): void => {
      this.currentView = view;
    });
  }

  public ngOnInit(): void {
    this.loadMajorFilters();
    this.loadStudentFilters();

    this.majorService.refreshNeeded.subscribe((): void => {
      this.loadMajorFilters();
    });

    this.viewService.currentView$.subscribe((view: string): void => {
      this.currentView = view;
    });
  }

  private loadMajorFilters(): void {
    this.facultyService.getFaculties().subscribe((faculties: FacultyElm[]): void => {
      this.facultyMap = new Map(faculties.map((f: FacultyElm): [any, any] => [f.id, f.facultyName]));

      this.majorService.getMajors().subscribe((data: MajorElm[]): void => {
        this.majors = data;

        const filterOptionsMajor = MajorTable.getFilterOptions(
          this.majors,
          this.facultyMap
        );

        this.faculties = filterOptionsMajor.faculties;
        this.types = filterOptionsMajor.types;
        this.subtypes = filterOptionsMajor.subtypes;
      });
    });
  }

  private loadStudentFilters(): void {
    const filterOptionsStudent = StudentTable.getFilterOptions(this.students);
    this.studentSubtypes = filterOptionsStudent.subtypes;
  }
}
