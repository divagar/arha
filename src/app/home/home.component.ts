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

          //Get daily step total
          this.getDailyStepTotal();
        }
      });
  }

  ngOnInit() {
  }

  getFitDataSource() {
    this.fitService.getDataSource()
      .subscribe(
      any => {
        console.log(any);
      },
      error => console.log(error));
  }

  getDailyStepTotal() {
    this.fitService.getDailyStepTotal()
      .subscribe(
      any => {
        console.log(any);
      },
      error => console.log(error));
  }


  showLoginSnackBar() {
    if (this.arhaLS.retrieve('gJustLoginedIn') == true) {
      this.arhaComponent.openSnackBar("Signed in !", "Ok");
      this.arhaLS.store('gJustLoginedIn', false);
    }
  }

}