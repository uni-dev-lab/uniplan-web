import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';

import {FacultyOptions} from '../../../features/faculty/faculty-options/faculty-options';
import {MajorOptions} from '../../../features/major/major-options/major-options';
import {FacultyTable} from '../../../features/faculty/faculty-table/faculty-table';
import {MajorTable} from '../../../features/major/major-table/major-table';
import {MajorFilters} from '../../../features/major/major-filters/major-filters';
import {StudentOptions} from '../../../features/student/student-options/student-options';
import {ELEMENT_STUDENT_DATA, StudentTable,} from '../../../features/student/student-table/student-table';
import {StudentFilters} from '../../../features/student/student-filters/student-filters';
import {MajorElm} from '../../interfaces/major-elm';
import {LoginForm} from '../../../features/login/login-form/login-form';
import {FacultyService} from '../../../features/faculty/faculty-service';
import {MajorService} from '../../../features/major/major-service';
import {MajorFilterState} from '../../interfaces/major-filter-state';
import {MajorFilterOptions} from '../../interfaces/major-filter-options';
import {StudentElm} from '../../interfaces/student-elm';
import {FacultyElm} from '../../interfaces/faculty-elm';
import {StudentFilterOptions} from '../../interfaces/student-filter-options';

@Component({
  selector: 'app-main-panel',
  standalone: true,
  templateUrl: './main-panel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-panel.scss',
  imports: [
    FacultyOptions,
    MajorOptions,
    FacultyTable,
    MajorTable,
    MajorFilters,
    StudentOptions,
    StudentTable,
    StudentFilters,
    LoginForm,
  ],
})
export class MainPanel implements OnInit {
  protected currentView: string = 'home';

  protected majors: MajorElm[] = [];
  protected students: StudentElm[] = ELEMENT_STUDENT_DATA;

  protected searchText: string = '';
  protected searchFacNum: string = '';
  protected searchMajor: string = '';
  protected selectedStudentSubtype: string = '';
  protected studentSubtypes: string[] = [];

  protected majorFiltersState: MajorFilterState = {
    selectedFaculty: '',
    selectedType: '',
    selectedSubtype: '',
  };

  protected majorFilterOptions: MajorFilterOptions = {
    faculties: [],
    types: [],
    subtypes: [],
  }

  private facultyMap: Map<string, string> = new Map<string, string>();

  private readonly majorService: MajorService = inject(MajorService);
  private readonly facultyService: FacultyService = inject(FacultyService);

  public ngOnInit(): void {
    this.loadMajorFilters();
    this.loadStudentFilters();

    this.majorService.refreshNeeded.subscribe(():void => {
      this.loadMajorFilters();
    });
  }

  private loadMajorFilters(): void {
    this.facultyService.getFaculties().subscribe((faculties: FacultyElm[]): void => {
      this.facultyMap = new Map(faculties.map((f: FacultyElm): [string, string] => [f.id, f.facultyName]));

      this.majorService.getMajors().subscribe((data: MajorElm[]): void => {
        this.majors = data;

        const filterOptionsMajor: MajorFilterOptions = MajorTable.getFilterOptions(
          this.majors,
          this.facultyMap
        );

        this.majorFilterOptions = {
          ...this.majorFilterOptions,
          faculties: filterOptionsMajor.faculties,
          types: filterOptionsMajor.types,
          subtypes: filterOptionsMajor.subtypes
        }
      });
    });
  }

  private loadStudentFilters(): void {
    const filterOptionsStudent: StudentFilterOptions = StudentTable.getFilterOptions(this.students);
    this.studentSubtypes = filterOptionsStudent.subtypes;
  }
}
