import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef,} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {FacultyService} from '../faculty-service';
import {EditForm} from '../../../core/shared/edit-form/edit-form';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-faculty-edit',
  templateUrl: './faculty-edit.html',
  styleUrl: './faculty-edit.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    EditForm,
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    TranslatePipe,
  ],
})
export class FacultyEdit {

  private readonly dialogRef:MatDialogRef<EditForm> = inject(MatDialogRef<EditForm>);
  private readonly facultyService:FacultyService = inject(FacultyService);
  public data: {
    id: string;
    facultyName: string;
    location: string;
    universityId: string;
  } = inject<{
    id: string;
    facultyName: string;
    location: string;
    universityId: string;
  }>(MAT_DIALOG_DATA);

  protected facultyName:string = this.data.facultyName;
  protected location:string = this.data.location;
  protected universityId:string = this.data.universityId;

  protected save(): void {
    if (!this.facultyName.trim()) {
      alert('Please enter faculty name.');
      return;
    }

    if (!this.location.trim()) {
      alert('Please enter location.');
      return;
    }

    this.facultyService
      .editFaculty(this.data.id, {
        facultyName: this.facultyName,
        location: this.location,
        universityId: this.universityId,
      })
      .subscribe({
        next: (): void => {
          this.dialogRef.close(true);
        },
        error: (): void => {
          alert('Failed to update faculty.');
        },
      });
  }
}
