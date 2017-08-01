import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { ArhaLocalStorageService } from './arha.localstorage.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

declare const gapi: any;

@Injectable()
export class ArhaAuthService {

  authState: Observable<firebase.User>;
  authUser: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
    private arhaLS: ArhaLocalStorageService) {
    this.authState = afAuth.authState;

    //gapi init
    this.initGapi();
  }

  initGapi() {
    this.loadGapi().then(() => {
      var auth2Args = {
        fetch_basic_profile: true,
        client_id: environment.gapi.client_id,
        scope: 'https://www.googleapis.com/auth/fitness.activity.read \
        https://www.googleapis.com/auth/fitness.location.read'
      }
      gapi.auth2.init(auth2Args).then(() => {
        this.listenGapi();
        //gapi refresh token
        this.gRefreshIdToken();
      });
    });
  }

  loadGapi(): Promise<any> {
    return new Promise(resolve => {
      gapi.load('client:auth2', resolve);
    });
  }

  listenGapi() {
    // Listen for sign-in state changes.
    var gAuth = gapi.auth2.getAuthInstance();
    gAuth.isSignedIn.listen(this.updateSigninStatus);
    // Handle the initial sign-in state.
    //this.updateSigninStatus(gAuth.isSignedIn.get());
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn)
      console.log('User signed in.');
    else
      console.log('User not signed in.');
  }

  gLogin() {
    var that = this;
    gapi.auth2.getAuthInstance().signIn()
      .then(function () {
        //firebase sign in - just call once and firebase session never expires.
        that.gFirebaseSignin();
      }, function (e) {
        console.log(e);
      });
  }

  gLogout(): firebase.Promise<any> {
    var gAuth = gapi.auth2.getAuthInstance();
    var that = this;
    gAuth.signOut().then(function () {
      console.log('User signed out.');
      that.arhaLS.store('gAccessToken', '');
      that.arhaLS.store('gIdToken', '');
      that.arhaLS.store('gExpiresIn', '');
      that.arhaLS.store('gExpiresAt', '');
      that.arhaLS.store('gJustLoginedIn', '');
    });
    return this.afAuth.auth.signOut();
  }

  gRefreshIdToken() {
    var expiresAt = this.arhaLS.retrieve('gExpiresAt');
    var now = Date.now();
    //check the token is expired and user is signed in
    if (now >= expiresAt && gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
      //firebase sign in - just call once and firebase session never expires.
      this.gFirebaseSignin();
    }
  }

  gFirebaseSignin() {
    var authResult = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true);
    this.arhaLS.store('gAccessToken', authResult.access_token);
    this.arhaLS.store('gIdToken', authResult.id_token);
    this.arhaLS.store('gExpiresIn', authResult.expires_in);
    this.arhaLS.store('gExpiresAt', authResult.expires_at);
    this.arhaLS.store('gJustLoginedIn', true);

    var credential = firebase.auth.GoogleAuthProvider.credential(authResult.id_token);
    //console.log(credential);
    firebase.auth().signInWithCredential(credential).then(function (user) {
      //console.log(user);
    });
  }

  getAuthStateDetails() {
    return this.authState;
  }

  getAuthUserDetails() {
    return this.authUser;
  }

  /*gLogin(): firebase.Promise<any> {
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
        }
        else
          this.arhaLS.store('gJustLoginedIn', false);
      })
      .catch((error) => {
      })
  }*/
}
