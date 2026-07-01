import { Component } from '@angular/core';
import { RoomTable } from '../room-table/room-table';

@Component({
  selector: 'app-room-panel',
  templateUrl: './room-panel.html',
  styleUrl: './room-panel.scss',
  imports: [RoomTable],
})

export class RoomPanel {

}
