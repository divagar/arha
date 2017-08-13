import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { ArhaComponent } from '../arha.component';
import { FitStepsComponent } from './fit.steps.component';
import { ArhaAuthService } from '../providers/arha.auth.service';
import { ArhaFitService } from '../providers/arha.fit.service';
import { ArhaLocalStorageService } from '../providers/arha.localstorage.service';

import * as Highcharts from 'highcharts/highcharts.src';
import * as HighchartsMore from 'highcharts/highcharts-more.src';
import * as HighchartsGauge from 'highcharts/modules/solid-gauge.src';
import 'highcharts/adapters/standalone-framework.src';

@Component({
  selector: 'arha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  authState: Observable<firebase.User>;

  //Fit data store
  fitDataStore: object;

  //chart
  @ViewChild('chart') public chartEl: ElementRef;
  private _chart: any;

  constructor(private afAuth: AngularFireAuth,
    private authService: ArhaAuthService,
    private fitService: ArhaFitService,
    private arhaLS: ArhaLocalStorageService,
    private arhaComponent: ArhaComponent) {

    this.authState = authService.getAuthStateDetails();
    this.fitDataStore = {};

    HighchartsMore(Highcharts);
    HighchartsGauge(Highcharts);

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

    //chart
    let chartOpts: any = {

      title: {
        text: '',
        style: {
          fontSize: '24px'
        }
      },

      credits: { enabled: false },

      colors: ['#F62366', '#9DFF02', '#0CCDD6'],

      tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
          fontSize: '16px'
        },
        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth) {
          return {
            x: 200 - labelWidth / 2,
            y: 180
          };
        }
      },

      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{ // Track for Move
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
            .setOpacity(0.3)
            .get(),
          borderWidth: 0
        }, { // Track for Exercise
          outerRadius: '87%',
          innerRadius: '63%',
          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
            .setOpacity(0.3)
            .get(),
          borderWidth: 0
        }, { // Track for Stand
          outerRadius: '62%',
          innerRadius: '38%',
          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2])
            .setOpacity(0.3)
            .get(),
          borderWidth: 0
        }]
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: true
        }
      },

      series: [{
        name: 'Move',
        data: [{
          color: Highcharts.getOptions().colors[0],
          radius: '112%',
          innerRadius: '88%',
          y: 80
        }]
      }, {
        name: 'Exercise',
        data: [{
          color: Highcharts.getOptions().colors[1],
          radius: '87%',
          innerRadius: '63%',
          y: 65
        }]
      }, {
        name: 'Stand',
        data: [{
          color: Highcharts.getOptions().colors[2],
          radius: '62%',
          innerRadius: '38%',
          y: 50
        }]
      }]
    };

    if (this.chartEl && this.chartEl.nativeElement) {
      chartOpts.chart = {
        type: 'solidgauge',
        renderTo: this.chartEl.nativeElement
      };
      this._chart = new Highcharts.Chart(chartOpts);
    }

  }

  showLoginSnackBar() {
    if (this.arhaLS.retrieve('gJustLoginedIn') == true) {
      this.arhaComponent.openSnackBar("Signed in !", "Ok");
      this.arhaLS.store('gJustLoginedIn', false);
    }
  }

}