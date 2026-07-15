import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { RoomElm } from '../../core/interfaces/room-elm';


@Injectable({
    providedIn: 'root'
})

export class RoomService {
    private apiUrl = 'http://localhost:8080/api/rooms';

    http = inject(HttpClient);

    getRooms(): Observable<RoomElm[]> {
        return this.http.get<RoomElm[] | null>(this.apiUrl).pipe(
            map(rooms => rooms ?? []),
            map(rooms =>
                rooms.map((room, index) => ({
                    id: room.id,
                    facultyId: room.facultyId,
                    roomNumber: room.roomNumber,
                    categoryId: room.categoryId,
                    position: index + 1,
                }))
            ),
            shareReplay(1)
        );
    }
}