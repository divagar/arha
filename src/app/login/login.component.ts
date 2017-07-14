import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ArhaComponent } from '../arha.component';
import { ArhaAuthService } from '../providers/arha.auth.service';

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

  login() {
    this.authService.gLogin();
  }

}
