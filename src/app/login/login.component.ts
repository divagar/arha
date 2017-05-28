import { Component, OnInit } from '@angular/core';
import { ArhaauthService } from '../providers/arhaauth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { ArhaComponent } from '../arha.component';

@Component({
  selector: 'arha-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(public authService: ArhaauthService,
    public arhaComponent: ArhaComponent) {
    this.user = this.authService.afAuth.authState;
  }

  ngOnInit() {
  }

  login() {
    this.authService.gLogin().then(() => {
      this.arhaComponent.openSnackBar("User signed in !", "Ok");
    },
    error => {
      this.arhaComponent.openSnackBar("Error occured while signing out !", "Ok");
    }
    );
  }
}
