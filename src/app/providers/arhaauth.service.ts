import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class ArhaauthService {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  gLogin(): firebase.Promise<any> {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/fitness.activity.read');
    //return this.afAuth.auth.signInWithPopup(provider);
    return this.afAuth.auth.signInWithRedirect(provider);

  }

  gLogout(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

  getSignInResult(): firebase.Promise<any> {
    return this.afAuth.auth.getRedirectResult();
  }

  getUserDetails() {
    return this.user;
  }

  gGetFittnessActivity() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }


}
