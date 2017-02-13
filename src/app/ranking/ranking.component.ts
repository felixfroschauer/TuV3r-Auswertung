import { Component, OnInit } from '@angular/core';
import {RestService} from "../rest.service";
import {Team} from "../entities/team";
import {forEach} from "@angular/router/src/utils/collection";
import {Tournament} from "../entities/tournament";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
  providers: [RestService]
})
export class RankingComponent{
  teams: Team[];
  tournament: Tournament = new Tournament(0, "");

  constructor(private repo: RestService) {
    this.repo.getTournament(1).subscribe(res => {
      //console.log(res);
      this.tournament=new Tournament(res.id,res.name);
      this.teams = res.teams;
      this.teams.sort(function (a,b) {
        if(a.rank > b.rank){
          return 1;
        }
        return -1;
      })
    });
  }


}
