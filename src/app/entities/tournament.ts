import {Team} from "./team";
import {Match} from "./match";

export class Tournament {
  constructor (public id: number,
               public name: string,
              /* public date: Date,
               public isActive: boolean,
               public pointsWin: number,
               public pointsDraw: number,
               public groupSize: number,
               public groupPhase: boolean,
               public system: string,
               public teams: Team[],
               public matches: Match[]*/
  ){ }
}
