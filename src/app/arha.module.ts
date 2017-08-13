import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { routing, arhaRoutingProviders } from './arha.routing';
import 'hammerjs';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { ArhaComponent } from './arha.component';
import { HomeComponent } from './home/home.component';
import { FitStepsComponent } from './home/fit.steps.component';
import { FitDistanceComponent } from './home/fit.distance.component';
import { FitCaloriesComponent } from './home/fit.calories.component';
import { TipsComponent } from './tips/tips.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { ArhaAuthService } from './providers/arha.auth.service';
import { ArhaFitService } from './providers/arha.fit.service';
import { ArhaLocalStorageService } from './providers/arha.localstorage.service';

@NgModule({
  declarations: [
    ArhaComponent,
    HomeComponent,
    TipsComponent,
    AboutComponent,
    LoginComponent,
    FitStepsComponent,
    FitDistanceComponent,
    FitCaloriesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    HttpModule,
    routing,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  providers: [
    arhaRoutingProviders,
    ArhaAuthService,
    ArhaFitService,
    ArhaLocalStorageService
  ],
  bootstrap: [ArhaComponent]
})
export class ArhaModule { }
