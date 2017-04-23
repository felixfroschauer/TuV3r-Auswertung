import {Component, Input, Output, EventEmitter} from '@angular/core';
import {RestClient} from "./rest.client";

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


  @Input() tournamentSelected: boolean=false;
  @Output() tournamentSelectedChange= new EventEmitter<boolean>();

  constructor(private _restService: RestClient){
    this.onStart()
  }

  onStart(){

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
    document.getElementById("ranking").style.marginTop="-2.5%";
  }

  loadPreviousView()
  {
    if(this.matchSelected==true) {
      this.matchSelected=false;
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
