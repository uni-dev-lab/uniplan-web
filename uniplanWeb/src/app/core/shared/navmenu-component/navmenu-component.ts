import { Component, HostListener, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  public authService = inject(LoginAuthService);

  isSidebarCollapsed = false;
  isMobileView = window.innerWidth <= 768;
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
    if (!this.isMobileView) {
      this.isSidebarCollapsed = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
