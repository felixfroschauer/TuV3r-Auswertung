import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RestService {
  constructor (private _http: Http){ }

  getData(){
    return this._http.get("http://localhost:8080/Turnierverwaltung/rs/team").map(res => res.json());
  }

  getTournament(id: number)
  {
    return this._http.get("http://localhost:8080/Turnierverwaltung/rs/tournament/"+id).map(res => res.json());
  }

  getTournamentDTOs(id: number)
  {
    return this._http.get("http://localhost:8080/Turnierverwaltung/rs/tournament/DTO").map(res => res.json());
  }

  postJson(json: string){
    return JSON.stringify(json);
  }
}
