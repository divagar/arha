import { Component, OnInit } from '@angular/core';
import { Routes, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { ArhaAuthService } from '../providers/arhaauth.service';

@Component({
  selector: 'arha-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})
export class TipsComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(public authService: ArhaAuthService,
    public router: Router) {
    this.user = authService.getUserDetails();
    //get af auth status
    this.user
      .do(user => this.checkLogin(user))
      .subscribe(user => this.checkLogin(user))
  }

  ngOnInit() {
  }

  checkLogin(user) {
    if (user == null)
      this.router.navigate(['/']);
  }

}
