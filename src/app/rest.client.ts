import { Injectable } from  '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Injectable()
export class RestClient {
  constructor (private _http: Http){ }

  getData(){
    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/team").map(res => res.json());
  }

  getMatchesForTeam(id:number){
    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match/by?teid="+id).map(res => res.json());
  }

  getTournament(id: number)
  {
    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/tournament/"+id).map(res => res.json());
  }

  getTournamentDTOs()
  {
    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/tournament").map(res => res.json());
  }

  getMatchesInTournament(id:number)
  {
    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match/by?toid="+id).map(res => res.json());
  }

  postJson(json: string){
    return JSON.stringify(json);
  }

  getRounds(id:number)
  {
    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/round/by?toid="+id).map(res => res.json());
  }

  getMatchesByRo(id:number)
  {
    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match/by?roid="+id).map(res => res.json());
  }

  getMatchesByTo(id:number){
    return this._http.get("http://vm15.htl-leonding.ac.at:8090/Turnierverwaltung/rs/match/by?toid="+id).map(res => res.json());
  }
}
