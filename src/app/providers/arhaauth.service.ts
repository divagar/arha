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
    this.afAuth.auth.signInWithRedirect(provider);
    return this.afAuth.auth.getRedirectResult();
  }

  gLogout(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

  getUserDetails() {
    return this.user;
  }

  gGetFittnessActivity() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }


}
