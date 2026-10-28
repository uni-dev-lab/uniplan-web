import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {AddForm} from '../../../core/shared/add-form/add-form';
import {FacultyService} from '../faculty-service';
import {UniversityElm, UniversityService,} from '../../university/university-service';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-faculty-add-form',
  templateUrl: './faculty-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faculty-add-form.scss',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    AddForm,
    TranslatePipe,
  ],
})
export class FacultyAddForm implements OnInit {
  protected facultyName: string = '';
  protected location: string = '';
  protected universityId: string = '';
  protected universities: UniversityElm[] = [];

  private readonly dialogRef: MatDialogRef<AddForm> = inject(MatDialogRef<AddForm>);
  private readonly facultyService: FacultyService = inject(FacultyService);
  private readonly universityService: UniversityService = inject(UniversityService);

  public ngOnInit(): void {
    this.universityService.getAllUniversities().subscribe({
      next: (data: UniversityElm[]): void => {
        this.universities = data;
      },
      error: (err: Error): void => {
        console.error('Failed to load universities', err);
      },
    });
  }

  protected save(): void {
    if (!this.facultyName.trim()) {
      alert('Please enter faculty name.');
      return;
    }

    if (!this.location.trim()) {
      alert('Please enter location.');
      return;
    }

    const newFaculty = {
      universityId: this.universityId,
      facultyName: this.facultyName,
      location: this.location,
    };

    this.facultyService.createFaculty(newFaculty).subscribe({
      next: (response: void): void => {
        console.log('Faculty created.');
        this.dialogRef.close(response);
      },
      error: (err: Error): void => {
        console.error('Failed to add faculty', err);
        alert('Failed to add faculty.');
      },
    });
  }
}
