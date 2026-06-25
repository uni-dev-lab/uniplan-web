import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { HomePanel } from './home-panel';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

 describe('HomePanel', () => {
   let component: HomePanel;
   let fixture: ComponentFixture<HomePanel>;

   beforeEach(async () => {
       await TestBed.configureTestingModule({
         imports: [HomePanel],
         providers: [
           provideTranslateService({
             loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
           }),
         ],
       }).compileComponents();

     fixture = TestBed.createComponent(HomePanel);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });

   it('should create', () => {
     expect(component).toBeTruthy();
   });
 });
