import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'arha',
  templateUrl: './arha.component.html',
  styleUrls: ['./arha.component.css']
})

export class ArhaComponent {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
    public snackBar: MdSnackBar) {
    this.user = afAuth.authState;
  }

  ngOnInit() {
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.openSnackBar("User signed out !", "Ok");
    },
    error => {
      this.openSnackBar("Error occured while signing out !", "Ok");
    }
    );

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}