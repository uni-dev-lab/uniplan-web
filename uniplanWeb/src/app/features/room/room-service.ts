import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { Room } from '../../core/interfaces/room';
import { Subject } from 'rxjs';
import { API_ENDPOINTS } from '../../config/endpoints';

@Injectable({
    providedIn: 'root'
})

export class RoomService {
    refreshNeeded = new Subject<void>();

    private http = inject(HttpClient);

    getRooms(): Observable<Room[]> {
        return this.http.get<Room[] | null>(API_ENDPOINTS.rooms).pipe(
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

    createRoom(room: {
        roomNumber: string;
        facultyId: string;
    }): Observable<Room> {
        return this.http.post<Room>(`${(API_ENDPOINTS.rooms)}`, room).pipe(
            map((res) => {
                this.refreshNeeded.next();
                return res;
            })
        );
    }
}