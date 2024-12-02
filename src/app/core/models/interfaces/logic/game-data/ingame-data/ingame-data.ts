import { FirestoreBase } from "../../firestore-base";
import { DynamicRoundData } from "./dynamic-round-data/dynamic-round-data";
import { PlayerData } from "./player-data";

export interface IngameData extends FirestoreBase {
    dynamicRoundData: DynamicRoundData | null;
    playerData: PlayerData[];
}