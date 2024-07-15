import firebase from 'firebase/compat/app';
import { Injectable } from "@angular/core";
import { IRoom } from "../../models/interfaces/logic/room/IRoom";
import { FirestoreService } from "./firestore.service";
import { Store } from "@ngxs/store";
import { AuthenticationState, LoadingError } from "../../state";
import { RoomSourceServiceErrors } from '../../constants/errorCodes';
import { catchError } from 'rxjs';
import { IPlayer } from '../../models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class RoomSourceService {
    private readonly usersRef = "users";
    private readonly roomsRef = "rooms";

    constructor(
        private store: Store,
        private firestoreService: FirestoreService<IRoom>
    ) { }

    ref(userId?: string) {
        if (!!!userId) {
            const id = this.store.selectSnapshot(AuthenticationState.user)?.id;
            if (!!!id) {
                throw new LoadingError(
                    RoomSourceServiceErrors.noUser,
                    RoomSourceService.name
                );
            }
            userId = id;
        }
        return `${this.usersRef}/${userId}/${this.roomsRef}`;
    }

    getRoom$(roomId: string, userId?: string) {
        return this.firestoreService.getDocWithId$(this.ref(userId), roomId)
            .pipe(
                catchError(() => {
                    throw new LoadingError(
                        RoomSourceServiceErrors.roomNotFound,
                        RoomSourceService.name
                    );
                })
            );
    }

    createRoom(name: string, description: string) {
        const user = this.store.selectSnapshot(AuthenticationState.user);
        if (!!user && !!user.id) {
            return this.firestoreService.add(
                this.ref(user.id),
                {
                    creationDate: firebase.firestore.Timestamp.fromDate(new Date()),
                    name: name,
                    description: description,
                    players: {}
                }
            );
        } else {
            return Promise.reject();
        }
    }

    updatePlayer(roomId: string, userId: string, player: IPlayer, roomOwnerId?: string) {
        return this.firestoreService.updateField(
            this.ref(roomOwnerId),
            roomId,
            `players.${userId}`,
            player
        );
    }
}