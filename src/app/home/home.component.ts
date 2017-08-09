import { Component, OnInit } from '@angular/core';
import { ArhaComponent } from '../arha.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ArhaAuthService } from '../providers/arha.auth.service';
import { ArhaFitService } from '../providers/arha.fit.service';
import { ArhaLocalStorageService } from '../providers/arha.localstorage.service';

@Component({
  selector: 'arha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  authState: Observable<firebase.User>;

  //Fit data store
  fitDataStore: object;

  constructor(private afAuth: AngularFireAuth,
    private authService: ArhaAuthService,
    private fitService: ArhaFitService,
    private arhaLS: ArhaLocalStorageService,
    private arhaComponent: ArhaComponent) {

    this.authState = authService.getAuthStateDetails();
    this.fitDataStore = {};

    //Get af auth status
    this.authState
      .subscribe(result => {
        if (result != null) {
          //showLoginSnackBar
          this.showLoginSnackBar();

          //Get fit data source
          //this.getFitDataSource();

          //Get daily summary
          this.getAllDailySummary();

          //subscribe daily summary
          this.subscribeToDailySummary();
        }
      });
  }

  ngOnInit() {
  }

  getFitDataSource() {
    this.fitService.getDataSource()
      .subscribe(
      data => console.log(data),
      error => console.log(error));
  }

  getAllDailySummary() {
    //Store the daily summary
    //this.arhaLS.store('gDailySummaryArr', []);
    this.arhaLS.store('gDailySummary', {});

    //Get step count
    this.getDailySummary('com.google.step_count.delta');
    //Get distance
    this.getDailySummary('com.google.distance.delta');
    //Get calories
    this.getDailySummary('com.google.calories.expended');
    //Get activity segment
    this.getDailySummary('com.google.activity.segment');
  }

  getDailySummary(dataType) {
    this.fitService.getDailySummary(dataType)
      .subscribe(
      data => {
        let bucketData = data.json()['bucket'][0]['dataset']['0']['point'];
        if (bucketData != 0) {
          //store daily summary
          let gDailySummaryObj = this.arhaLS.retrieve('gDailySummary');
          gDailySummaryObj[bucketData['0'].dataTypeName] = bucketData;
          this.arhaLS.store('gDailySummary', gDailySummaryObj);

          //store daily summary
          // let gDailySummary = this.arhaLS.retrieve('gDailySummaryArr');
          // bucketData.forEach(element => {
          //   gDailySummary.push(element);
          // });
          // this.arhaLS.store('gDailySummaryArr', gDailySummary);
        }
      },
      error => console.log(error));
  }

  subscribeToDailySummary() {
    this.arhaLS.storage.subscribe(
      (fitData) => {
        console.log(fitData);
        if (fitData.hasOwnProperty('gDailySummary')) {
          let fit = fitData['gDailySummary'];
          let query = 'com.google.step_count.delta';

          if (fit.hasOwnProperty(query))
            this.processSteps(query, fit[query]);

          query = 'com.google.distance.delta';
          if (fit.hasOwnProperty(query))
            this.processDistance(query, fit[query]);

          query = 'com.google.calories.expended';
          if (fit.hasOwnProperty(query))
            this.processCalories(query, fit[query]);

          query = 'com.google.activity.summary';
          if (fit.hasOwnProperty(query))
            this.processActivity(query, fit[query]);
        }
      }
    )
  }

  processSteps(query, fitData) {
    if (fitData.hasOwnProperty('0')) {
      this.fitDataStore[query] = {
        'startTimeNanos': fitData[0]['startTimeNanos'],
        'endTimeNanos': fitData[0]['endTimeNanos'],
        'count': fitData[0]['value']['0']['intVal']
      };
    }
  }

  processDistance(query, fitData) {
    if (fitData.hasOwnProperty('0')) {
      this.fitDataStore[query] = {
        'startTimeNanos': fitData[0]['startTimeNanos'],
        'endTimeNanos': fitData[0]['endTimeNanos'],
        'count': ((fitData[0]['value']['0']['fpVal']) / 1000).toFixed(2)
      };
    }
  }

  processSleep(query, fitData) {
    this.fitDataStore[query] = {};

  }

  processCalories(query, fitData) {
    if (fitData.hasOwnProperty('0')) {
      this.fitDataStore[query] = {
        'startTimeNanos': fitData[0]['startTimeNanos'],
        'endTimeNanos': fitData[0]['endTimeNanos'],
        'count': (fitData[0]['value']['0']['fpVal']).toFixed(0)
      };
    }
  }

  processActivity(query, fitData) {
    fitData.forEach(element => {
      let activityType = element['value']['0']['intVal'];
      let activityName = this.fitService.getGActivityType(activityType);
      this.fitDataStore[activityName] = {
        'startTimeNanos': element['startTimeNanos'],
        'endTimeNanos': element['endTimeNanos'],
        'count': element['value']['1']['intVal']
      };
    });
    console.log(this.fitDataStore);
  }

  showLoginSnackBar() {
    if (this.arhaLS.retrieve('gJustLoginedIn') == true) {
      this.arhaComponent.openSnackBar("Signed in !", "Ok");
      this.arhaLS.store('gJustLoginedIn', false);
    }
  }

}