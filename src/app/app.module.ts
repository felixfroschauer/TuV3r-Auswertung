import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RankingComponent } from './ranking/ranking.component';
import { MatchesComponent } from './matches/matches.component';
import { CurrentroundComponent } from './currentround/currentround.component';

@NgModule({
  declarations: [
    AppComponent,
    RankingComponent,
    MatchesComponent,
    CurrentroundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
