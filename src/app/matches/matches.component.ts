import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {RestClient} from "../rest.client";
import {Match} from "../entities/match";
import {isUndefined} from "util";

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  _selectedTeam: number;

  matchesOfTeam: Match[]=[];
  //@Output() _matchesOfTeam= new EventEmitter<number>();

  team1:String;
  team2:String;
  //matchIP:String;


  constructor(private repo: RestClient) {

  }

  ngOnInit() {
  }

  @Input()
  set selectedTeam(id: number) {
    this._selectedTeam = id;
    this.matchesOfTeam=[];
    if(!isUndefined(this._selectedTeam)) {
      this.repo.getMatchesForTeam(this._selectedTeam).subscribe(res => {
        res.forEach(item => {

          if(item.team1==null) {
            this.team1="Wildcard";

          }
          else {
            this.team1=item.team1.name;
          }
          if(item.team2==null) {
            this.team2="Wildcard";
          }
          else {
            this.team2=item.team2.name;
          }
          this.matchesOfTeam.push(new Match(item.id, this.team1, this.team2, item.result));
        });
        console.log("MATCHES: " + this.matchesOfTeam)
      });
    }
  }
}
