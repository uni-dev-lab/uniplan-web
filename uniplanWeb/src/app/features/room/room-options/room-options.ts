import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddButton } from '../../../core/shared/add-button/add-button';
import { RoomAddForm } from '../room-add-form/room-add-form';

@Component({
  selector: 'app-room-options',
  templateUrl: './room-options.html',
  styleUrl: './room-options.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    AddButton
  ],
})
export class RoomOptions {
  private dialog = inject(MatDialog)
  openAddForm() {
    this.dialog.open(RoomAddForm, {
      width: '400px',
    });
  }
}
