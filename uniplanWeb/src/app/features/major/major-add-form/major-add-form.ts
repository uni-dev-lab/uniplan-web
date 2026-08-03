import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel,} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MajorService } from '../major-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { FacultyService } from '../../faculty/faculty-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-major-add-form',
  templateUrl: './major-add-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './major-add-form.scss',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    AddForm,
    MatFormFieldModule,
    MatSelectModule,
    TranslatePipe,
  ],
})

export class MajorAddForm implements OnInit {
  private dialogRef = inject<MatDialogRef<AddForm>>(MatDialogRef);
  private majorService = inject(MajorService);
  private facultyService = inject(FacultyService);

  majorName = '';
  faculty = '';
  type = '';
  subtype = '';

  faculties: FacultyElm[] = [];

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => {
        this.faculties = data;
      },
      error: (err) => console.error('Failed to load faculties', err),
    });
  }

  save(): void  {
    if (
      !this.majorName.trim() ||
      !this.faculty ||
      !this.type ||
      !this.subtype
    ) {
      alert('Please fill all fields.');
      return;
    }

    this.majorService
      .createMajorWithCourse({
        facultyId: this.faculty,
        majorName: this.majorName,
        type: this.type,
        subtype: this.subtype,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => alert('Failed to create major or course.'),
      });
  }
}
