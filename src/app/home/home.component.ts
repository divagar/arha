import { Component, OnInit } from '@angular/core';
import { ArhaComponent } from '../arha.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ArhaAuthService } from '../providers/arhaauth.service';

@Component({
  selector: 'arha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
    public authService: ArhaAuthService,
    public arhaComponent: ArhaComponent) {

    this.getSignInResult();
    this.getUserDetails();
  }

  ngOnInit() {
  }

  getSignInResult() {
    this.authService.getSignInResult().then((data) => {
      this.arhaComponent.openSnackBar("Signed in !", "Ok");
      console.log(data);
    },
      error => {
        this.arhaComponent.openSnackBar("Error occured while signing out !", "Ok");
      }
    );
  }

  getUserDetails() {
    this.user = this.authService.getUserDetails();
    console.log(this.user);
    this.user
      .do(user => console.log(user))
      .subscribe(user => console.log(user));
  }

}