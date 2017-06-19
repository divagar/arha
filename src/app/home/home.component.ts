import { Component, OnInit } from '@angular/core';
import { ArhaComponent } from '../arha.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ArhaAuthService } from '../providers/arhaauth.service';
import { ArhaFitService } from '../providers/arhafit.service';

@Component({
  selector: 'arha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
    public authService: ArhaAuthService,
    public fitService: ArhaFitService,
    public arhaComponent: ArhaComponent) {

    this.getSignInResult();
    this.getUserDetails();
  }

  ngOnInit() {
  }

  getSignInResult() {
    this.authService.getSignInResult().then((data) => {
      this.arhaComponent.openSnackBar("Signed in !", "Ok");
      //console.log(data);
    },
      error => {
        this.arhaComponent.openSnackBar("Error occured while signing out !", "Ok");
      }
    );
  }

  getUserDetails() {
    this.user = this.authService.getUserDetails();

    this.user
      .do(user => {
        console.log(user);
        console.log(user.refreshToken);
        //get fit data source
        this.fitService.getDataSource(user.refreshToken)
          .subscribe(
          any => console.log(any),
          error => console.log(error));
      })
      .subscribe(user => console.log(user));
  }

}