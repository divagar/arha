import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class ArhaAuthService {

  auth: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
    this.getSignInResult();
    this.auth = afAuth.authState;
  }

  gLogin(): firebase.Promise<any> {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/fitness.activity.read');
    return this.afAuth.auth.signInWithRedirect(provider);
  }

  gLogout(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

  getSignInResult() {
    this.afAuth.auth.getRedirectResult()
      .then((result) => {
        if (result.credential) {
          //TODO: show a snackbar on successful login.
          //this.arhaComponent.openSnackBar("Signed in !", "Ok");
        }
      })
      .catch((error) => {
      })
  }

  getAuthDetails() {
    return this.auth;
  }

}
