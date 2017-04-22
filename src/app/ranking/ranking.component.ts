import {Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild} from '@angular/core';
import {RestClient} from "../rest.client";
import {Team} from "../entities/team";
import {forEach} from "@angular/router/src/utils/collection";
import {Tournament} from "../entities/tournament";
import {Match} from "../entities/match";
import {log} from "util";
declare var jQuery: any;


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
  providers: [RestClient]
})
export class RankingComponent{
  teams: Team[]=[];
  tournament: Tournament = new Tournament(0, "");
  tournamentID: number=1;
  tournaments: Tournament[]= [];
  matches:Match[]=[];
  allMatches:Match[]=[];
  any:any[]=[];

  @ViewChild('tournamentTree') input: ElementRef;

  @Input() private _teamSelected: number;
  @Output() teamSelectedChange= new EventEmitter<number>();

  @Input() private tournamentSelected: boolean=false;
  @Output() tournamentSelectedChange= new EventEmitter<boolean>();

  constructor(private repo: RestClient) {

    this.fillSelect();
    this.getAllMatches(this.tournamentID);
    //this.fillTable(this.tournamentID);
  }

  @Input()
  set tournamentSelectedChanged(b: boolean) {
    this.tournamentSelected=b;
  }

  fillSelect(){
    this.repo.getTournamentDTOs().subscribe(res => {
      console.log("Result"+res[0].id+" "+res[0].name);
        res.forEach(item => this.tournaments.push(new Tournament(item.id, item.name)));
        //this.tournaments.push(new Tournament(res[0].id, res[1].name));
    });
    console.log(this.tournaments);
  }

  fillTable(tournamentID: number){
    this.teams=[];
    this.repo.getTournament(tournamentID).subscribe(res => {
      //console.log(res);
      this.tournamentID=res.id;
      this.tournament=new Tournament(res.id,res.name);
      //this.any=res.teams;
      res.teams.forEach(item=>this.teams.push(new Team(item.id,item.name,item.rank,item.occupied,item.group,"")));
      //this.teams=res.teams;
      this.teams.sort(function (a,b) {
        if(a.rank > b.rank){
          return 1;
        }
        return -1;
      })
      this.setTeamRanks();
      this.teams.forEach(item=>{
        if(item.name==null)
        {
          this.teams.splice(this.teams.indexOf(item),1);

        }
        if(item.name=="Fill-in")
        {
          this.teams.splice(this.teams.indexOf(item),1);
        }
      });
    });
  }

  showMatches(id:number){
    this._teamSelected=id;
    this.teamSelectedChange.emit(this._teamSelected);
  }

  showRankings(id:number) {
    this.fillTable(id);
    this.tournamentSelected=true;
    this.tournamentSelectedChange.emit(this.tournamentSelected);
  }

  setTeamRanks(){

    //get total number of rounds
    var roundCount: number=this.getRoundCount();

    this.teams.forEach(team=>
    {
      this.repo.getMatchesForTeam(team.id).subscribe(res=>
      {
        res.forEach(match=>
        {
          if(match.team1!=null) {
            if (match.team1.id != this.winnerOfMatch(match)) {
              var round=match.round.count;

              if(round==roundCount-1) {
                match.team2.rankdesc="3. Platz";
                match.team1.rankdesc="3. Platz";
              } else {
                var rankdescription = this.getDescription(round);
                this.teams.filter(item => item.id == match.team1.id)[0].rankdesc = rankdescription;
              }
            }
          }
          if(match.team2!=null) {
            if (match.team2.id != this.winnerOfMatch(match)) {
              var round=match.round.count;

              if(round==roundCount-1) {
                match.team1.rankdesc="3. Platz";
                match.team2.rankdesc="3. Platz";
              }else {
                var rankdescription = this.getDescription(round);
                this.teams.filter(item => item.id == match.team2.id)[0].rankdesc = rankdescription;
              }
            }
          }
        });
      });
    });
  }

  getDescription(round:number)
  {
    var output: string;


    //get total number of rounds
    var roundCount: number=this.getRoundCount();

    if(round==roundCount+1){
      output="Zweitplatziert";
    } else {
      // var num = power-(+team.rankdesc);
      output= "Bis zur "+round+ ". Runde gekommen";
    }
    return output;
  }

  getRoundCount(){
    var countTeams: number=this.teams.length;
    var roundCount: number=0;
    var exit: boolean=false;
    while(!exit) {
      roundCount++;
      countTeams=countTeams/2;
      if(countTeams<=1)
      {
        exit=true;
      }
    }
    return roundCount;
  }

  /*updateRankDesc()
  {
    var countTeams: number=this.teams.length;
    var power: number=0;
    var exit: boolean=false;
    var sortedTeams:Team[]=[];
    sortedTeams.length=4;
    var tail: Team[]=[];

    while(!exit) {
      power++;
      countTeams=countTeams/2;
      if(countTeams<=1)
      {
        exit=true;
      }
    }

    this.teams.forEach(team=>
    {
      if(team.rankdesc==""){
        team.rankdesc="Gewonnen!";
        team.rank=1;
        this.sortedTeams[0]=team;
      } else if(+team.rankdesc==power){
        team.rankdesc="Zweitplatziert";
        team.rank=2;
        this.sortedTeams[1]=team;
      } else if(+team.rankdesc==power-1){
        team.rank=3;
        if(this.sortedTeams[2]==null) {
          team.rankdesc = "3.Platz";
          this.sortedTeams[2] = team;
        }
        else{
          team.rankdesc="4.Platz";
          this.sortedTeams[3] = team;
        }
      } else {
        team.rank=(+team.rankdesc);
        // var num = power-(+team.rankdesc);
        team.rankdesc= "Bis zur "+(+team.rankdesc)+ ". Runde gekommen";
        tail.push(team);
      }
    });
    tail.sort(function (a,b) {
      if(a.rank < b.rank){
        return 1;
      }
      return -1;
    });
    tail.forEach(item=>
    {
      this.sortedTeams.push(item);
    });
    this.sortedTeams.forEach(t=>{
      if(t.name==null)
      {
        this.sortedTeams.splice(t.id,1);
      }
    });
    this.teams=this.sortedTeams;
  }

  setRanks() {
    var counter = 0;
    var teamsLenght=this.teams.length;

    this.teams.forEach(team=>
    {
      this.repo.getMatchesForTeam(team.id).subscribe(res=>
      {
        res.forEach(match=>
        {
          if(match.team1!=null) {
            if (match.team1.id != this.winnerOfMatch(match)) {
              this.teams.filter(item=>item.id==match.team1.id)[0].rankdesc=match.round.count;
            }
          }
          if(match.team2!=null) {
            if (match.team2.id != this.winnerOfMatch(match)) {
              this.teams.filter(item=>item.id==match.team2.id)[0].rankdesc=match.round.count;
            }
          }

          counter++;
          if (counter == teamsLenght) {
            setTimeout(() => {
                this.updateRankDesc()
              }, 2500);
          }
        });
      });
    });
  }*/



  winnerOfMatch(any:any)
  {
    if(any.resultObject.pointsSecondTeam>any.resultObject.pointsFirstTeam)
    {
      return any.team2.id;
    }else if(any.resultObject.pointsSecondTeam<any.resultObject.pointsFirstTeam) {
      return any.team1.id
    }else if(any.resultObject.pointsSecondTeam<any.resultObject.pointsFirstTeam) {
      if(any.team1==null)
      {
        return any.team2.id;
      }
      else{
        return any.team1.id
      }
    }
  }

  /*setRanks() {
    var countTeams: number=this.teams.length;
    var power: number=0;

    while(countTeams!=1) {
      power++;
      countTeams=countTeams/2;
    }

    this.teams.forEach(team=>
    {
      this.repo.getMatchesForTeam(team.id).subscribe(res=>{
        var wins:number;
        res.forEach( item=> {
              if (item.team1.id==team.id) {
                if(item.resultObject.pointsFirstTeam>item.resultObject.pointsSecondTeam) {
                  wins++;
                }
              }
              else{
                if(item.resultObject.pointsFirstTeam<item.resultObject.pointsSecondTeam) {
                  wins++;
                }
              }
              this.teams.filter(t=>t.id==team.id)[0].rank=countTeams/Math.pow(2,(power-wins));
          }
        );
      });
    });
  }*/

  getMatches(id:number)
  {
    this.repo.getMatchesInTournament(id).subscribe(res=>{
      res.forEach(match=> {
        var team1:String;
        var team2:String;
        if(match.team1==null) {
          team1="Fill-in";
        }
        else {
          team1=match.team1.name;
        }
        if(match.team2==null) {
          team2="Fill-in";
        }
        this.matches.push(new Match(match.id, team1, team2, match.resultObject.pointsFirstTeam, match.resultObject.pointsSecondTeam));
      });
    });
  }

  getAllMatches(id:number)
  {
    this.repo.getMatches(id).subscribe(res=>{
      this.allMatches=[];
      res.forEach(match=>{
          var team1:String;
          var team2:String;
          if(match.team1==null) {
            team1="Fill-in";
          }
          else {
            team1=match.team1.name;
          }
          if(match.team2==null) {
            team2="Fill-in";
          }else{
            team2=match.team2.name;
          }
          this.allMatches.push(new Match(match.id, team1, team2, match.resultObject.pointsFirstTeam, match.resultObject.pointsSecondTeam));
       }
      );
      this.allMatches.reverse();
    });
  }
}
