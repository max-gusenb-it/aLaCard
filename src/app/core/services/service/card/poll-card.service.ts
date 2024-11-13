import { Result, PollCard, PollResponse, Response, Card } from "src/app/core/models/interfaces";
import { BaseCardService } from "./base-card.service";
import { Injectable } from "@angular/core";
import { DynamicPollRoundData } from "src/app/core/models/interfaces/logic/game-data/ingame-data/dynamic-round-data/dynamic-poll-card-round.data";

@Injectable({
    providedIn: 'root'
})
export class PollCardService extends BaseCardService<PollCard, PollResponse, DynamicPollRoundData, Result> {
    override castCard(card: Card): PollCard {
        let pollCard = <PollCard> card;
        return {
            ...pollCard,
            subjects: pollCard.subjects.map((c, index) => {
                return {
                    id: index,
                    ...c
                }
            })
        }
    }

    override createDynamicRoundData(roundId: number, responses: Response[]): DynamicPollRoundData {
        const pvResponses = this.castResponses(responses);
        let drd : DynamicPollRoundData = super.createDynamicRoundData(roundId, responses);
        drd.responses = pvResponses;
        return drd;
    }
}