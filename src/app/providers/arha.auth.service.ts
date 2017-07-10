import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ArhaLocalStorageService } from './arha.localstorage.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class ArhaAuthService {

  authState: Observable<firebase.User>;
  authUser: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
    private arhaLS: ArhaLocalStorageService) {
    this.authState = afAuth.authState;
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
          console.log(result);
          this.authUser = result.user;
          this.arhaLS.store('gAccessToken', result.credential.accessToken);
          this.arhaLS.store('gIdToken', result.credential.idToken);
          this.arhaLS.store('gJustLoginedIn', true);
          //test code
          /*var credential = firebase.auth.GoogleAuthProvider.credential(
            result.credential.idToken);
          console.log(credential);
          firebase.auth().signInWithCredential(credential).then(function (user) {
            console.log(user);
          });*/
        }
        else
          this.arhaLS.store('gJustLoginedIn', false);
      })
      .catch((error) => {
      })
  }

  getAuthStateDetails() {
    return this.authState;
  }

  getAuthUserDetails() {
    return this.authUser;
  }

}
