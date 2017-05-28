import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'arha',
  templateUrl: './arha.component.html',
  styleUrls: ['./arha.component.css']
})

export class ArhaComponent {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  ngOnInit() {
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}