import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { FacultyService } from '../../faculty/faculty-service';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { RoomService } from '../room-service';

@Component({
  selector: 'app-room-add-form',
  templateUrl: './room-add-form.html',
  styleUrl: './room-add-form.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    AddForm,
    TranslatePipe,
    ReactiveFormsModule
  ],
})

export class RoomAddForm implements OnInit {
  private dialogRef = inject(MatDialogRef<AddForm>);
  private facultyService = inject(FacultyService);
  private roomService = inject(RoomService)
  faculties: FacultyElm[] = [];
  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);
  private isSubmitting = false;
  private _snackBar = inject(MatSnackBar);

  addForm = new FormGroup({
    roomNumber: new FormControl('', Validators.required),
    facultyId: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.facultyService.getFaculties()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.faculties = data;
        },
        error: (err) => {
          console.error('Failed to load faculties', err);
        },
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  save() {
    if (this.addForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.addForm.disable();

    const newRoom = {
      roomNumber: this.addForm.value.roomNumber ?? '',
      facultyId: this.addForm.value.facultyId ?? '',
    };

    this.roomService.createRoom(newRoom)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting = false;
          this.addForm.enable();
        }))
      .subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (err) => {
          console.error('Failed to add room', err);
          this.openSnackBar(
            this.translate.instant('room.add.failed'),
            this.translate.instant('shared.close-btn')
          );
        },
      });
  }
}
