import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LoginAuthService} from '../../../services/login-auth-service';

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
  private readonly router = inject(Router);

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

    this.router.navigate(['/']);
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
