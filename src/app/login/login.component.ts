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
    this.authService.gLogin().then((data) => {
      this.arhaComponent.openSnackBar("User signed in !", "Ok");
      console.log(data);
    },
    error => {
      this.arhaComponent.openSnackBar("Error occured while signing out !", "Ok");
    }
    );
  }
}
