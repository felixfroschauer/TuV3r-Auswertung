import { Component } from '@angular/core';
import {RestService} from "./rest.service";
import {Team} from "./entities/team";
import {plainToClass} from "class-transformer";
import {Tournament} from "./entities/tournament";

@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
  providers: [RestService]
})
export class AppComponent {
  data: string;
  teams: Team[] = [];
  round: number = 0;
  tournament: Tournament[] = [];

  constructor(private _restService: RestService){
    this.onStart()
  }

  onStart(){

  }

  getTeams(){
    this._restService.getData()
      .subscribe(
        data => this.data = JSON.stringify(data),
      )
    this.teams = plainToClass(Team, JSON.parse(this.data));
    this.round++;
  }

  getTournament(id: number){
    this._restService.getTournament(id)
      .subscribe(
        data => this.data = JSON.stringify(data),
      )
    this.tournament = plainToClass(Tournament, JSON.parse(this.data));
    this.round++;
  }

  onClick(){
    this.round++;
  }
}
