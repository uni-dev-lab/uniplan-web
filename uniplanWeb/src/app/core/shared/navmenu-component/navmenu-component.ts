import { Component } from '@angular/core';
import { LoginAuthService } from '../../login-auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navmenu-component',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './navmenu-component.html',
  styleUrl: './navmenu-component.scss'
})
export class NavmenuComponent {
     constructor(public authService: LoginAuthService) {}
}
