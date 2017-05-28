import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class ArhaauthService {

  constructor(public afAuth: AngularFireAuth) {
  }
  gLogin(): firebase.Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  gLogout(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

}
