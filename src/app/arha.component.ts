import 'hammerjs';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { MdSnackBar } from '@angular/material';
import { ArhaAuthService } from './providers/arha.auth.service';
import { ArhaLocalStorageService } from './providers/arha.localstorage.service';

@Component({
  selector: 'arha',
  templateUrl: './arha.component.html',
  styleUrls: ['./arha.component.css']
})

export class ArhaComponent {

  authState: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
    private snackBar: MdSnackBar,
    private authService: ArhaAuthService,
    private arhaLS: ArhaLocalStorageService) {
    this.authState = authService.getAuthStateDetails();
  }

  ngOnInit() {
  }

  logout() {
    this.authService.gLogout()
      .then(() => {
        this.openSnackBar("Signed out !", "Ok");
        //TODO: find a way to toggle sidnav
        //sidenav.toggle()
      })
      .catch(() => {
        this.openSnackBar("Error occured while signing out !", "Ok");
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}