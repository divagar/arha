import { Component, OnInit } from '@angular/core';
import { ArhaauthService } from '../providers/arhaauth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'arha-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(public authService: ArhaauthService) {
    this.user = this.authService.afAuth.authState;
   }

  ngOnInit() {
  }

  login() {
    this.authService.gLogin();
  }
}
