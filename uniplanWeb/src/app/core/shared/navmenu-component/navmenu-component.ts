import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewService } from '../main-panel/view.service';
import { LoginAuthService } from '../../../services/login-auth-service';

@Component({
  selector: 'app-navmenu-component',
  templateUrl: './navmenu-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./navmenu-component.scss'],
  imports: [CommonModule],
})
export class NavmenuComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobileView = window.innerWidth <= 768;

  constructor(
    public authService: LoginAuthService,
    public viewService: ViewService
  ) { }

  ngOnInit(): void {
    this.checkViewport();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkViewport();
  }

  private checkViewport(): void {
    const isNowMobile = window.innerWidth <= 768;
    if (this.isMobileView !== isNowMobile) {
      this.isMobileView = isNowMobile;
    }
    if (!this.isMobileView) {
      this.isSidebarCollapsed = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onHomeClick(): void {
    this.viewService.setView('home');
  }

  onFacultyClick(): void {
    this.viewService.setView('faculty');
  }

  onMajorClick(): void {
    this.viewService.setView('major');
  }

  onStudentClick(): void {
    this.viewService.setView('student');
  }
}
