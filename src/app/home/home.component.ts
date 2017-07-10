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
        //console.log(result);
        if (result != null) {
          //showLoginSnackBar
          this.showLoginSnackBar();

          //refresh the token
          //this.refreshAccessToken(result);

          //Get fit data source.
          this.getFitDataSource();
        }
      });
  }

  ngOnInit() {
  }

  refreshAccessToken(result) {
    this.fitService.refreshAccessToken(result.m, result.refreshToken)
      .subscribe(
      any => {
        console.log(any);
        //this.arhaLS.store('gAccessToken', 'ya29.' + any.access_token);
        //Get fit data source.
        //this.getFitDataSource();
      },
      error => console.log(error));
  }

  getFitDataSource() {
    this.fitService.getDataSource()
      .subscribe(
      any => {
        console.log(any);
        //Get id token
        /*this.afAuth.auth.currentUser.getIdToken()
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
          })*/
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