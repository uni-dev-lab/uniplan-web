import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LoginAuthService} from '../../../services/login-auth-service';
import {ViewService} from '../../../core/shared/main-panel/view.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  protected username: string = '';
  protected password: string = '';
  protected errorMessage: string = '';

  private readonly authService: LoginAuthService = inject(LoginAuthService);
  private readonly viewService: ViewService = inject(ViewService);

  protected login(event: Event): void {
    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'Моля, въведете потребителско име.';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Моля въведете парола.';
      return;
    }

    const isLoggedIn: boolean = this.authService.login(this.username, this.password);

    if (!isLoggedIn) {
      this.errorMessage = 'Невалидни потребителски данни.';
      return;
    }

    this.viewService.setView('home');
  }

  protected onUsernameChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.username = input.value;
  }

  protected onPasswordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.password = input.value;
  }
}
