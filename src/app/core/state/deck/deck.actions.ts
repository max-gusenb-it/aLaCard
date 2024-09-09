import { Deck } from "../../models/interfaces";

export namespace DeckActions {
    export class AddDeck {
        static readonly type = "[Store|Decks] AddDeck";
        constructor(public deck: Deck) {};
    }
}