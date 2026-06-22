import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginAuthService {
  private loggedIn = false;

  public constructor() {
    this.loggedIn = !!localStorage.getItem('user');
  }

  public login(username: string, password: string): boolean {
    if (!username || !password) {
      return false;
    }

    localStorage.setItem('user', username);
    this.loggedIn = true;

    return true;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.loggedIn = false;
  }

  public getUsername(): string {
    return localStorage.getItem('user') ?? '';
  }
}
