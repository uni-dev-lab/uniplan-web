import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { RoomViewModel } from '../../core/interfaces/room-view-model';
import { Room } from '../../core/interfaces/room';


@Injectable({
    providedIn: 'root'
})

export class RoomService {
    private apiUrl = 'http://localhost:8080/api/rooms';

    http = inject(HttpClient);

    getRooms(): Observable<RoomViewModel[]> {
        return this.http.get<Room[] | null>(this.apiUrl).pipe(
            map(rooms => rooms ?? []),
            map(rooms =>
                rooms.map((room, index) => ({
                    id: room.id,
                    facultyId: room.facultyId,
                    roomNumber: room.roomNumber,
                    position: index + 1,
                }))
            ),
            shareReplay(1)
        );
    }
}
