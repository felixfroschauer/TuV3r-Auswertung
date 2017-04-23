import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Match} from "../entities/match";
import {RestClient} from "../rest.client";
import {MatchInDepth} from "../entities/matchInDepth";

@Component({
  selector: 'app-currentround',
  templateUrl: './currentround.component.html',
  styleUrls: ['./currentround.component.css']
})
export class CurrentroundComponent implements OnInit {

  matchesDone: Match[]=[];
  matchesToBeDone: MatchInDepth[]=[];
  matchesLastRound: Match[]=[];

  round:number=1;
  _tournamentID: number=1;

  @Input()
  set tournamentID(id: number) {
    this._tournamentID=id;
  }

  constructor(private repo: RestClient) { }

  ngOnInit() {
    this.getRound();
  }

  getRound(){
    this.repo.getRounds(this._tournamentID).subscribe(res => {
      var latest=1;
      var prev=1;
      res.forEach(r => {
        if(r.id>latest)
        {
          prev=latest;
          latest=r.id;
          this.round=r.count;
        }
      });
      this.matchesDone=[];
      this.matchesToBeDone=[];
      this.matchesLastRound=[];
      this.getMatches(latest);
      if(prev!=0)
      {
        this.getMatchesPrevRound(prev);
      }
    });
  }

  showFinalRankings(){

  }

  getMatches(id:number){
    this.repo.getMatchesByRo(id).subscribe(res =>{
      res.forEach(match=>{
        if(match.active) {
          var team1;
          var team2;

          if(match.team1==null) {
            team1="Wildcard";
            team2=match.team2.name;
          }else if(match.team2==null)
          {
            team1=match.team1.name;
            team2="Wildcard";
          }else{
            team1=match.team1.name;
            team2=match.team2.name;
          }
          this.matchesToBeDone.push(new MatchInDepth(match.id, team1, team2, match.result, match.startTime, match.court));
        }else{
          var team1;
          var team2;

          if(match.team1==null) {
            team1="Wildcard";
            team2=match.team2.name;
          }else if(match.team2==null)
          {
            team1=match.team1.name;
            team2="Wildcard";
          }else{
            team1=match.team1.name;
            team2=match.team2.name;
          }
          this.matchesDone.push(new Match(match.id, team1, team2,match.result));
        }
      });
    });
  }

  getMatchesPrevRound(id:number){
    this.repo.getMatchesByRo(id).subscribe(res =>{
      res.forEach(match=>{
        var team1;
        var team2;

        if(match.team1==null) {
          team1="Wildcard";
          team2=match.team2.name;
        }else if(match.team2==null)
        {
          team1=match.team1.name;
          team2="Wildcard";
        }else{
          team1=match.team1.name;
          team2=match.team2.name;
        }
        this.matchesLastRound.push(new Match(match.id, team1, team2,match.result));});
    });
  }
}
