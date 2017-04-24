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
  tournaments: Tournament[]= [];
  matches:Match[]=[];
  allMatches:Match[]=[];
  //any:any[]=[];
  podest:String[]=[];


  @Input() private tournamentID: number=1;
  @Output() tournamentIDChange= new EventEmitter<number>();

  @Input() private _teamSelected: number;
  @Output() teamSelectedChange= new EventEmitter<number>();

  @Input() private tournamentSelected: boolean=false;
  @Output() tournamentSelectedChange= new EventEmitter<boolean>();

  _showEndStatistic:boolean=false;

  constructor(private repo: RestClient) {
    this.podest.length=3;
    this.fillSelect();
    this.getAllMatches(this.tournamentID);
    //localStorage.setItem('currentTournament', JSON.stringify(1));

    //this.fillTable(this.tournamentID);
  }

  @Input()
  set tournamentSelectedChanged(b: boolean) {
    this.tournamentSelected=b;
  }

  @Input()
  set showEndStatistic(b: boolean) {
    this._showEndStatistic=b;
    if(b){
      if(JSON.parse(localStorage.getItem('currentTournament'))!=null){
        var id:number=+JSON.parse(localStorage.getItem('currentTournament'));
        this.fillTable(id);
      }else {
        this.fillTable(this.tournamentID);
      }
    }
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
    if(tournamentID==1&&JSON.parse(localStorage.getItem('currentTournament'))!=null){
      var id:number=+JSON.parse(localStorage.getItem('currentTournament'));
      if(id!=tournamentID){
        tournamentID=id;
      }
    }
    this.getAllMatches(tournamentID);
      this.teams = [];
      this.repo.getTournament(tournamentID).subscribe(res => {
        //console.log(res);
        //this.tournamentID = res.id;
        this.tournament = new Tournament(res.id, res.name);
        //this.any=res.teams;
        res.teams.forEach(item => this.teams.push(new Team(item.id, item.name, item.rank, item.occupied, item.group, "")));
        //this.teams=res.teams;
        this.teams.sort(function (a, b) {
          if (a.rank > b.rank) {
            return 1;
          }
          return -1;
        })
        this.teams.forEach(item => {
          if (item.name == null) {
            this.teams.splice(this.teams.indexOf(item), 1);

          }
          if (item.name == "Fill-in") {
            this.teams.splice(this.teams.indexOf(item), 1);
          }
        });
        this.setTeamRanks();
      });
  }

  showMatches(id:number){
    this._teamSelected=id;
    this.teamSelectedChange.emit(this._teamSelected);
  }

  showTournament(id:number) {
    //this.fillTable(id);
    this.tournamentSelected=true;
    this.tournamentSelectedChange.emit(this.tournamentSelected);
    this.tournamentID=id;
    this.tournamentIDChange.emit(id);
    localStorage.setItem('currentTournament', JSON.stringify(id));


    window.open("http://localhost:4200/live", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

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
          if(match.round!=null)
          {
            //check mini finale
            if(match.round.count==roundCount-1)
            {
              var id=this.winnerOfMatch(match);
              this.teams.filter(item => item.id == id)[0].rankdesc = "3.Platz";
              this.teams.filter(item => item.id == id)[0].rank=3;
              this.podest[2]=this.teams.filter(item => item.id == id)[0].name;

              if(id==match.team1.id)
              {
                this.teams.filter(item => item.id == match.team2.id)[0].rankdesc = "4.Platz";
                this.teams.filter(item => item.id == match.team2.id)[0].rank=4;
              }else{
                this.teams.filter(item => item.id == match.team1.id)[0].rankdesc = "4.Platz";
                this.teams.filter(item => item.id == match.team1.id)[0].rank=4;
              }
            }
            //check finale
            else if(match.round.count==roundCount)
            {
              var id=this.winnerOfMatch(match);
              this.teams.filter(item => item.id == id)[0].rankdesc = "1.Platz";
              this.teams.filter(item => item.id == id)[0].rank=1;
              this.podest[0]=this.teams.filter(item => item.id == id)[0].name;

              if(id==match.team1.id)
              {
                this.teams.filter(item => item.id == match.team2.id)[0].rankdesc = "2.Platz";
                this.teams.filter(item => item.id == match.team2.id)[0].rank=2;
                this.podest[1]=this.teams.filter(item => item.id == match.team2.id)[0].name;

              }else{
                this.teams.filter(item => item.id == match.team1.id)[0].rankdesc = "2.Platz";
                this.teams.filter(item => item.id == match.team1.id)[0].rank=2;
                this.podest[1]=this.teams.filter(item => item.id == match.team1.id)[0].name;
              }
            }else{
              var id=this.winnerOfMatch(match);
              if((match.team1.id==id)&&(this.teams.filter(item => item.id == match.team2.id)[0].rankdesc=="")){
                this.teams.filter(item => item.id == match.team2.id)[0].rankdesc = "Bis zur "+match.round.count+". Runde gekommen";
                this.teams.filter(item => item.id == match.team2.id)[0].rank=(1+roundCount-match.round.count)+2;
              }else if((match.team2.id==id)&&(this.teams.filter(item => item.id == match.team1.id)[0].rankdesc=="")){
                this.teams.filter(item => item.id == match.team1.id)[0].rankdesc = "Bis zur "+match.round.count+". Runde gekommen";
                this.teams.filter(item => item.id == match.team1.id)[0].rank=(1+roundCount-match.round.count)+2;
              }
            }
          }

        });
        this.teams.sort((a: any, b: any) => {
          if (a.rank < b.rank) {
            return -1;
          } else if (a.rank > b.rank) {
            return 1;
          } else {
            return 0;
          }
        });
      });
    });

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
    return roundCount+1;
  }

  winnerOfMatch(any:any)
  {
    var splitPoints=any.result.split(":");
    var pointsFirstTeam=+splitPoints[0];
    var pointsSecondTeam=+splitPoints[1];


    if(pointsSecondTeam>pointsFirstTeam)
    {
      return any.team2.id;
    }else if(pointsSecondTeam<pointsFirstTeam) {
      return any.team1.id
    }
    /*else if(pointsSecondTeam<pointsFirstTeam) {
      if(any.team1==null)
      {
        return any.team2.id;
      }
      else{
        return any.team1.id
      }
    }*/
  }


  /*
  updateRankDesc()
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
        sortedTeams[0]=team;
      } else if(+team.rankdesc==power){
        team.rankdesc="Zweitplatziert";
        team.rank=2;
        sortedTeams[1]=team;
      } else if(+team.rankdesc==power-1){
        team.rank=3;
        if(sortedTeams[2]==null) {
          team.rankdesc = "3.Platz";
          sortedTeams[2] = team;
        }
        else{
          team.rankdesc="4.Platz";
          sortedTeams[3] = team;
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
      sortedTeams.push(item);
    });
    sortedTeams.forEach(t=>{
      if(t.name==null)
      {
        sortedTeams.splice(t.id,1);
      }
    });
    this.teams=sortedTeams;
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
        this.matches.push(new Match(match.id, team1, team2, match.result));
      });
    });
  }

  getAllMatches(tid:number)
  {
    if(tid==1&&JSON.parse(localStorage.getItem('currentTournament'))!=null){
      var id:number=+JSON.parse(localStorage.getItem('currentTournament'));
      if(tid!=id){
        tid=id;
      }
    }
    this.repo.getMatchesByTo(tid).subscribe(res=>{
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
        this.allMatches.push(new Match(match.id, team1, team2, match.result));
       }
      );
      this.allMatches.reverse();
    });
  }
}
