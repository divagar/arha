import { Component, OnInit } from '@angular/core';
import { ArhaComponent } from '../arha.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ArhaAuthService } from '../providers/arhaauth.service';
import { ArhaFitService } from '../providers/arhafit.service';

@Component({
  selector: 'arha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  auth: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
    private authService: ArhaAuthService,
    private fitService: ArhaFitService,
    private arhaComponent: ArhaComponent) {
    this.auth = authService.getAuthDetails();

    //get af auth status
    this.auth
      .subscribe(result => {
      });
  }

  ngOnInit() {
  }

  // //get fit data source
  // this.fitService.getDataSource(result.credential.accessToken)
  //   .subscribe(
  //   any => console.log(any),
  //   error => console.log(error));
}