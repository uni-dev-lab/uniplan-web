import { Component, HostListener, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LoginAuthService } from '../../../services/login/login-auth-service';

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

  protected readonly authService: LoginAuthService = inject(LoginAuthService);
  private readonly router: Router = inject(Router);

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
      this.isSidebarCollapsed = isNowMobile;
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeSidebarIfMobile(): void {
    if (this.isMobileView) {
      this.isSidebarCollapsed = true;
    }
  }

  protected onLogoutClick(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
