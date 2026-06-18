import { Component, Inject, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatLabel } from '@angular/material/form-field';
import { FacultyService } from '../faculty-service';
import { EditForm } from '../../../core/shared/edit-form/edit-form';

@Component({
  selector: 'app-faculty-edit-form',
  templateUrl: './faculty-edit-form.html',
  styleUrl: './faculty-edit-form.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    EditForm,
    MatDialogModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class FacultyEditForm implements OnInit {
  private formBuilder = inject(FormBuilder)

  facultyForm!: FormGroup;

  public data = inject<{
    id: string;
    facultyName: string;
    location: string;
    universityId: string;
  }>(MAT_DIALOG_DATA);

  constructor(
    private dialogRef: MatDialogRef<EditForm>,
    private facultyService: FacultyService,
  ) {}

  ngOnInit(): void {
    this.initForm()
    
    if (this.data) {
      this.facultyForm.patchValue({
        facultyName: this.data.facultyName,
        location: this.data.location,
        universityId: this.data.universityId,
      });
    }
  }

  private initForm() {
    this.facultyForm = this.formBuilder.group({
      facultyName: ['', [Validators.required]],
      location: ['', [Validators.required]],
      universityId: ['']
    });
  }

  save() {
    const { facultyName, location, universityId } = this.facultyForm.value;

    if (!facultyName.trim()) {
      alert('Please enter faculty name.');
      return;
    }

    if (!location.trim()) {
      alert('Please enter location.');
      return;
    }

    this.facultyService
      .editFaculty(this.data.id, {
        facultyName: facultyName,
        location: location,
        universityId: universityId,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          alert('Failed to update faculty.');
        },
      });
  }
}
