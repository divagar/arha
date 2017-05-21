import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { routing, arhaRoutingProviders } from './arha.routing';
import 'hammerjs';
import { MaterialModule } from '@angular/material';
import { ArhaComponent } from './arha.component';
import { HomeComponent } from './home/home.component';
import { TipsComponent } from './tips/tips.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    ArhaComponent,
    HomeComponent,
    TipsComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    HttpModule,
    routing,
  ],
  providers: [
    arhaRoutingProviders
  ],
  bootstrap: [ArhaComponent]
})
export class ArhaModule { }
