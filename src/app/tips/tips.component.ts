import { Component, OnInit } from '@angular/core';
import { Routes, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { ArhaAuthService } from '../providers/arha.auth.service';

@Component({
  selector: 'arha-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})
export class TipsComponent implements OnInit {

  authState: Observable<firebase.User>;

  constructor(private authService: ArhaAuthService,
    private router: Router) {
    this.authState = authService.getAuthStateDetails();

    //get af auth status
    this.authState
      .subscribe(result => this.checkLogin(result))
  }

  ngOnInit() {
  }

  checkLogin(user) {
    if (user == null)
      this.router.navigate(['/']);
  }

}
