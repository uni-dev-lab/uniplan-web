import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewService } from '../main-panel/view.service';
import { LoginAuthService } from '../../../services/login-auth-service';

@Component({
  selector: 'app-navmenu-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navmenu-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./navmenu-component.scss'],
})
export class NavmenuComponent implements OnInit {
  protected isSidebarCollapsed: boolean = false;
  protected isMobileView: boolean = window.innerWidth <= 768;

  constructor(
    protected authService: LoginAuthService,
    private readonly viewService: ViewService
  ) {}

  public ngOnInit(): void {
    this.checkViewport();
  }

  @HostListener('window:resize', ['$event'])
  protected onResize(event: Event): void {
    this.checkViewport();
  }

  private checkViewport(): void {
    const isNowMobile: boolean = window.innerWidth <= 768;
    if (this.isMobileView !== isNowMobile) {
      this.isMobileView = isNowMobile;
    }
    if (!this.isMobileView) {
      this.isSidebarCollapsed = false;
    }
  }

  protected toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  protected onHomeClick(): void {
    this.viewService.setView('home');
  }

  protected onFacultyClick(): void {
    this.viewService.setView('faculty');
  }

  protected onMajorClick(): void {
    this.viewService.setView('major');
  }

  protected onStudentClick(): void {
    this.viewService.setView('student');
  }
}
