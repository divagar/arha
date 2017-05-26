import { Component, OnInit } from '@angular/core';
import { ArhaauthService } from '../providers/arhaauth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'arha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(public authService: ArhaauthService) {
    this.user = this.authService.afAuth.authState;
  }

  ngOnInit() {
  }

  logout() {
    this.authService.gLogout();
  }

}
