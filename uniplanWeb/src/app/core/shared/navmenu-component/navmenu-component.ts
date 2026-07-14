import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  protected isMobileView = window.innerWidth <= 768;
  protected isSidebarCollapsed = this.isMobileView;

  constructor(protected authService: LoginAuthService) {}

  ngOnInit(): void {
    this.checkViewport();
  }

  @HostListener('window:resize', ['$event'])
  protected onResize(event: Event): void {
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

  protected toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  protected onSidebarContentClick(event: MouseEvent): void {
    const clickedLink = (event.target as HTMLElement).closest('a');
    if (this.isMobileView && !this.isSidebarCollapsed && clickedLink) {
      this.isSidebarCollapsed = true;
    }
  }
}
