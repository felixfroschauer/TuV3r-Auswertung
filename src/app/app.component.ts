import {Component, Input, Output, EventEmitter} from '@angular/core';
import {RestClient} from "./rest.client";
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
  providers: [RestClient]
})
export class AppComponent {
  matchSelected: boolean=false;
  teamSelected: number;
  backButtonActive: boolean=false;
  resultsVisible: boolean=false;

  public location = '' ;

  @Input() showEndStatistic: boolean;
  @Output() showEndStatisticChange= new EventEmitter<boolean>();

  @Input() tournamentID: number=1;
  @Output() tournamentIDChange= new EventEmitter<number>();

  @Input() tournamentSelected: boolean=false;
  @Output() tournamentSelectedChange= new EventEmitter<boolean>();

  @Input() private showCurrentTournament: boolean=false;
  @Output() showCurrentTournamentChanged= new EventEmitter<boolean>();

  constructor(private _restService: RestClient, private  _router : Router){
    this.location = _router.url;
    this.onStart()
  }

  onStart(){

  }

  onShowEndStatisticChanged(b: boolean)
  {
    this.showEndStatistic=b;
  }

  onShowCurrentTournamentChanged(b: boolean)
  {
    this.showCurrentTournament=b;
  }

  onTournamentIDChanged(id: number)
  {
    this.tournamentID=id;
  }

  onTeamSelectedChanged(id: number)
  {
    this.matchSelected=true;
    this.teamSelected=id;
    this.backButtonActive=true;
  }

  onTournamentSelectedChanged()
  {
    this.backButtonActive=true;
    this.tournamentSelected=true;
    this.tournamentSelectedChange.emit(this.tournamentSelected);
    this.location = this._router.url;
    document.getElementById("ranking").style.marginTop="-2.5%";
  }

  loadPreviousView()
  {
    if(this.matchSelected==true) {
      this.matchSelected=false;
    }else if(this.showEndStatistic==true){
      this.showEndStatistic=false;
    } else {
      this.tournamentSelected=false;
      this.backButtonActive=false;
      document.getElementById("ranking").style.marginTop="2.5%";
    }
  }

  setResultsVisible() {
    this.resultsVisible=true;
    document.getElementById("resultView").setAttribute("class", "active");
    document.getElementById("tutorial").removeAttribute("class");
  }

  setTutorialVisible(){
    this.resultsVisible=false;
    document.getElementById("tutorial").setAttribute("class", "active");
    document.getElementById("resultView").removeAttribute("class");
  }
}
