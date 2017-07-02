import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ArhaLocalStorageService } from './arhalocalstorage.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class ArhaAuthService {

  auth: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
    private arhaLS: ArhaLocalStorageService) {

    this.auth = afAuth.authState;

    //sign in result
    this.getSignInResult();
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
          this.arhaLS.store('gToken', result.credential.accessToken);
          this.arhaLS.store('gJustLoginedIn', true);
        }
        else
          this.arhaLS.store('gJustLoginedIn', false);
      })
      .catch((error) => {
      })
  }

  getAuthDetails() {
    return this.auth;
  }

}
