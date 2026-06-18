import { ComponentFixture, TestBed } from '@angular/core/testing';
 import { MatDialog } from '@angular/material/dialog';
 import { Subject, of } from 'rxjs';

 import { FacultyPanel } from './faculty-panel';
 import { FacultyService } from '../faculty-service';
 import { FacultyElm } from '../../../core/interfaces/faculty-elm';

 describe('FacultyPanel', () => {
   let component: FacultyPanel;
   let fixture: ComponentFixture<FacultyPanel>;
   let facultyServiceSpy: jasmine.SpyObj<FacultyService>;
   let dialogSpy: jasmine.SpyObj<MatDialog>;

   const buildFaculty = (overrides: Partial<FacultyElm> = {}): FacultyElm => ({
     id: '1',
     facultyName: 'Faculty of Engineering',
     location: 'Sofia',
     universityId: 'u1',
     position: 1,
     ...overrides,
   });

   beforeEach(async () => {
     facultyServiceSpy = jasmine.createSpyObj<FacultyService>(
       'FacultyService',
       ['getFaculties'],
       { refreshNeeded: new Subject<void>() }
     );
     facultyServiceSpy.getFaculties.and.returnValue(of([]));

     dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

     await TestBed.configureTestingModule({
       imports: [FacultyPanel],
       providers: [
         { provide: FacultyService, useValue: facultyServiceSpy },
         { provide: MatDialog, useValue: dialogSpy },
       ],
     }).compileComponents();

     fixture = TestBed.createComponent(FacultyPanel);
     component = fixture.componentInstance;
   });

   it('should create', () => {
     fixture.detectChanges();
     expect(component).toBeTruthy();
   });

   it('should render the faculty options and faculty table', () => {
     fixture.detectChanges();
     const compiled = fixture.nativeElement as HTMLElement;
     expect(compiled.querySelector('app-faculty-options')).toBeTruthy();
     expect(compiled.querySelector('app-faculty-table')).toBeTruthy();
   });

   it('should display faculties returned by the faculty service', () => {
     facultyServiceSpy.getFaculties.and.returnValue(
       of([buildFaculty({ facultyName: 'Faculty of Mathematics' })])
     );

     fixture.detectChanges();

     const compiled = fixture.nativeElement as HTMLElement;
     expect(compiled.querySelector('td.col-name')?.textContent).toContain(
       'Faculty of Mathematics'
     );
   });

   it('should show no rows when there are no faculties', () => {
     fixture.detectChanges();

     const compiled = fixture.nativeElement as HTMLElement;
     expect(compiled.querySelectorAll('td.col-name').length).toBe(0);
   });
 });
