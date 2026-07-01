import { Component } from '@angular/core';
import { RoomTable } from '../room-table/room-table';
import { RoomOptions } from '../room-options/room-options';

@Component({
  selector: 'app-room-panel',
  templateUrl: './room-panel.html',
  styleUrl: './room-panel.scss',
  imports: [RoomTable, RoomOptions],
})

export class RoomPanel {

}
