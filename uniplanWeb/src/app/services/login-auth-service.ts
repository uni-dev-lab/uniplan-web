import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginAuthService {

  public login(username: string, password: string): boolean {
    if (!username || !password) {
      return false;
    }

    localStorage.setItem('user', username);

    return true;
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  public logout(): void {
    localStorage.removeItem('user');
  }

  public getUsername(): string {
    return localStorage.getItem('user') ?? '';
  }
}
