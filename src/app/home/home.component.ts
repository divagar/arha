import { Component, OnInit } from '@angular/core';
import { ArhaComponent } from '../arha.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ArhaAuthService } from '../providers/arha.auth.service';
import { ArhaFitService } from '../providers/arha.fit.service';
import { ArhaLocalStorageService } from '../providers/arha.localstorage.service';

@Component({
  selector: 'arha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  authState: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
    private authService: ArhaAuthService,
    private fitService: ArhaFitService,
    private arhaLS: ArhaLocalStorageService,
    private arhaComponent: ArhaComponent) {
    this.authState = authService.getAuthStateDetails();

    //Get af auth status
    this.authState
      .subscribe(result => {
        if (result != null) {
          //showLoginSnackBar
          this.showLoginSnackBar();

          //Get fit data source
          this.getFitDataSource();

          //Get step count
          this.getDailySummary('com.google.step_count.delta');

          //Get calories
          this.getDailySummary('com.google.calories.expended');

          //Get distance
          this.getDailySummary('com.google.distance.delta');

          //Get activity segment
          this.getDailySummary('com.google.activity.segment');

        }
      });
  }

  ngOnInit() {
  }

  getFitDataSource() {
    this.fitService.getDataSource()
      .subscribe(
      any => console.log(any),
      error => console.log(error));
  }

  getDailySummary(dataType) {
    this.fitService.getDailySummary(dataType)
      .subscribe(
      any => console.log(any),
      error => console.log(error));
  }

  showLoginSnackBar() {
    if (this.arhaLS.retrieve('gJustLoginedIn') == true) {
      this.arhaComponent.openSnackBar("Signed in !", "Ok");
      this.arhaLS.store('gJustLoginedIn', false);
    }
  }

}