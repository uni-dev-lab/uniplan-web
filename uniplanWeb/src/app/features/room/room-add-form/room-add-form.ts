
import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AddForm } from '../../../core/shared/add-form/add-form';
import { TranslatePipe } from '@ngx-translate/core';
import { FacultyService } from '../../faculty/faculty-service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FacultyElm } from '../../../core/interfaces/faculty-elm';
import { RoomService } from '../room-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-room-add-form',
  templateUrl: './room-add-form.html',
  styleUrl: './room-add-form.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  save() {
    if (this.addForm.invalid) {
      return;
    }

    const newRoom = {
      roomNumber: this.addForm.value.roomNumber ?? '',
      facultyId: this.addForm.value.facultyId ?? '',
    };

    this.roomService.createRoom(newRoom)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Room created:', response);
          this.dialogRef.close(response);
        },
        error: (err) => {
          console.error('Failed to add room', err);
          alert(this.translate.instant('room.add.failed'));
        },
      });
  }
}
