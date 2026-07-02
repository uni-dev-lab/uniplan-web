import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {
  private loggedIn: boolean = false;

  constructor() {
    this.loggedIn = !!localStorage.getItem('user');
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.loggedIn = false;
  }
}
