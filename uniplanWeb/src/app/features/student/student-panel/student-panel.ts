import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';

import { StudentOptions } from '../student-options/student-options';
import { StudentFilters } from '../student-filters/student-filters';
import { StudentTable } from '../student-table/student-table';

import { StudentFilterState } from '../../../core/interfaces/student-filter-state';
import { StudentFilterOptions } from '../../../core/interfaces/student-filter-options';

import { ResponsiveFilters, ResponsiveFilterValues } from '../../../core/shared/responsive-filters/responsive-filters';

@Component({
  selector: 'app-student-panel',
  imports: [StudentOptions, StudentFilters, StudentTable, ResponsiveFilters],
  templateUrl: './student-panel.html',
  styleUrl: './student-panel.scss'
})
export class StudentPanel {
  protected readonly internalSearchText: WritableSignal<string> =
    signal<string>('');

  protected readonly studentFilterState: WritableSignal<StudentFilterState> =
    signal<StudentFilterState>({
      searchFacNum: '',
      searchMajor: '',
      selectedSubtype: ''
    });

  protected readonly studentFilterOptions: WritableSignal<StudentFilterOptions> =
    signal<StudentFilterOptions>({
      subtypes: []
    });

  protected readonly emptyResponsiveFilters: ResponsiveFilterValues = {
    internalSearchText: '',
    searchFacNum: '',
    searchMajor: '',
    selectedSubtype: ''
  };

  protected readonly responsiveFilterValues: Signal<ResponsiveFilterValues> =
    computed<ResponsiveFilterValues>((): ResponsiveFilterValues => ({
      internalSearchText: this.internalSearchText(),
      ...this.studentFilterState()
    }));

  protected onResponsiveFiltersChange(values: ResponsiveFilterValues): void {
    this.internalSearchText.set(values['internalSearchText'] ?? '');

    this.studentFilterState.set({
      searchFacNum: values['searchFacNum'] ?? '',
      searchMajor: values['searchMajor'] ?? '',
      selectedSubtype: values['selectedSubtype'] ?? ''
    });
  }
}
