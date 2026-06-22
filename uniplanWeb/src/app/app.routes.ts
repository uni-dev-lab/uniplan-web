import { Routes } from '@angular/router';
import { LayoutComponent } from './layout-component/layout-component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home-panel/home-panel').then(m => m.HomePanel),
      },
      {
        path: 'faculty',
        loadComponent: () =>
          import('./features/faculty/faculty-panel/faculty-panel').then(m => m.FacultyPanel),
      },
      {
        path: 'major',
        loadComponent: () =>
          import('./features/major/major-panel/major-panel').then(m => m.MajorPanel),
      },
      {
        path: 'student',
        loadComponent: () =>
          import('./features/student/student-panel/student-panel').then(m => m.StudentPanel),
      },
      { path: '**', loadComponent: () =>
          import('./features/not-found/not-found-panel/not-found-panel').then(m => m.NotFoundPanel),  },
    ],
  },
];
