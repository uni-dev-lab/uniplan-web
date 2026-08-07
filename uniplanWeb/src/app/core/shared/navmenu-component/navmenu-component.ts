import { Component, HostListener, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LoginAuthService } from '../../../services/login-auth-service';

@Component({
  selector: 'app-navmenu-component',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navmenu-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./navmenu-component.scss'],
})
export class NavmenuComponent implements OnInit {
  isMobileView = window.innerWidth <= 768;
  isSidebarCollapsed = this.isMobileView;

  public authService = inject(LoginAuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.checkViewport();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkViewport();
  }

  private checkViewport(): void {
    const isNowMobile = window.innerWidth <= 768;
    if (this.isMobileView !== isNowMobile) {
      this.isMobileView = isNowMobile;
    }
    this.isSidebarCollapsed = isNowMobile;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeSidebarIfMobile(): void {
    if (this.isMobileView) {
      this.isSidebarCollapsed = true;
    }
  }

  onHomeClick(): void {
    this.router.navigate(['/']);
  }

  onFacultyClick(): void {
    this.router.navigate(['/faculties]']);
  }

  onMajorClick(): void {
    this.router.navigate(['/majors']);
  }

  onStudentClick(): void {
    this.router.navigate(['/students']);
  }

  protected onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  protected onLogoutClick(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  protected onProfileOpenClick(): void {
    this.router.navigate(['/']);
  }
}
