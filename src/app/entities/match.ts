import {Team} from "./team";
//noinspection TypeScriptCheckImport
import {Result} from "./result";

export class Match {
  constructor (public id: number,
               public isActive: boolean,
               public team1: Team,
               public team2: Team,
               public result: Result
  ){ }
}
