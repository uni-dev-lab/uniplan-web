import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewService {
  private viewSubject: BehaviorSubject<string> = new BehaviorSubject<string>('home');
  currentView$: any = this.viewSubject.asObservable();

  public setView(view: string): void {
    this.viewSubject.next(view);
  }
}
