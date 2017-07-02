import { Component, OnInit } from '@angular/core';
import { ArhaComponent } from '../arha.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ArhaAuthService } from '../providers/arhaauth.service';
import { ArhaFitService } from '../providers/arhafit.service';
import { ArhaLocalStorageService } from '../providers/arhalocalstorage.service';

@Component({
  selector: 'arha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  auth: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
    private authService: ArhaAuthService,
    private fitService: ArhaFitService,
    private arhaLS: ArhaLocalStorageService,
    private arhaComponent: ArhaComponent) {
    this.auth = authService.getAuthDetails();

    //Get af auth status
    this.auth
      .subscribe(result => {

        //refresh the token
        this.fitService.refreshAccessToken(result.refreshToken)
          .subscribe(
          any => console.log(any),
          error => console.log(error));

        //Get fit data source.
        this.getFitDataSource();
      });
  }

  ngOnInit() {
    //TODO: first login Show the snack bar
    /*if(this.arhaLS.retrieve('gJustLoginedIn') == 'true')
      this.arhaComponent.openSnackBar("Signed in !", "Ok");*/
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

}