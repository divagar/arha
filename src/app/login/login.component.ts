import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ArhaComponent } from '../arha.component';
import { ArhaAuthService } from '../providers/arha.auth.service';

declare const gapi: any;

@Component({
  selector: 'arha-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  constructor(private authService: ArhaAuthService,
    private arhaComponent: ArhaComponent) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initGapi();
  }

  initGapi() {
    this.loadGapi().then(() => {
      var auth2Args = {
        fetch_basic_profile: true,
        client_id: environment.gapi.client_id,
        scope: 'https://www.googleapis.com/auth/fitness.activity.read'
      }
      gapi.auth2.init(auth2Args).then(() => {
        this.listenGapi();
      });
    });
  }

  loadGapi(): Promise<any> {
    console.log("load");
    return new Promise(resolve => {
      gapi.load('client:auth2', resolve);
    });
  }

  listenGapi() {
    console.log("listen");
    // Listen for sign-in state changes.
    var gAuth = gapi.auth2.getAuthInstance();
    gAuth.isSignedIn.listen(this.updateSigninStatus);
    // Handle the initial sign-in state.
    this.updateSigninStatus(gAuth.isSignedIn.get());
  }

  updateSigninStatus(isSignedIn) {
    console.log("updateSigninStatus....", isSignedIn);
    if (isSignedIn) {
      console.log('User signed in.');
    };
  }

  login() {
    //this.authService.gLogin();
    gapi.auth2.getAuthInstance().signIn();
    console.log(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true));
  }

  logout() {
    var gAuth = gapi.auth2.getAuthInstance();
    gAuth.signOut().then(function () {
      console.log('User signed out.');
    });
  }
}
