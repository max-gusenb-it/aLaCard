import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Card, DynamicRoundData, Player, PlayerVotingResult, Result, Round } from 'src/app/core/models/interfaces';
import { StaticRoundDataService } from 'src/app/core/services/data/static-round-data.data.service';
import { PlayerVotingCardService } from 'src/app/core/services/service/card/player-voting-card.service';
import { RoomState } from 'src/app/core/state';

@Component({
  selector: 'player-voting-stats',
  templateUrl: './player-voting-stats.component.html'
})
export class PlayerVotingStatsComponent implements AfterViewInit {
  
  @Input() card: Card;
  @Input() round: Round;
  @Input() dynamicRoundData: DynamicRoundData;

  results: PlayerVotingResult[];
  players: Player[];

  constructor(
    private staticRoundDataService: StaticRoundDataService,
    private playerVotingService: PlayerVotingCardService,
    private store: Store,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.players = this.store.selectSnapshot(RoomState.players);
    this.results = this.playerVotingService.getResults(this.dynamicRoundData);
    this.changeDetectorRef.detectChanges();
  }

  getCardText() {
    return this.playerVotingService.getCardText(
        this.card,
        this.store.selectSnapshot(RoomState.players),
        this.round.playerIds,
        this.store.selectSnapshot(RoomState.specificPlayerId),
    );
  }

  getPlayerForResult(result: PlayerVotingResult) {
    return this.players.find(p => p.id === result.votedPlayerId);
  }

  startNextRound() {
    this.staticRoundDataService.startNewRound();
  }

}
