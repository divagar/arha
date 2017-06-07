import { Component, OnInit } from '@angular/core';
import { ArhaComponent } from '../arha.component';
import { ArhaauthService } from '../providers/arhaauth.service';

@Component({
  selector: 'arha-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: ArhaauthService,
    public arhaComponent: ArhaComponent) {
  }

  ngOnInit() {
  }

  login() {
    this.authService.gLogin();
  }
}
