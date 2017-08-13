import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { ArhaLocalStorageService } from '../providers/arha.localstorage.service';
import { ArhaAuthService } from '../providers/arha.auth.service';
import { ArhaFitService } from '../providers/arha.fit.service';

import * as Highcharts from 'highcharts/highcharts.src';
import * as HighchartsMore from 'highcharts/highcharts-more.src';
import * as HighchartsGauge from 'highcharts/modules/solid-gauge.src';
import 'highcharts/adapters/standalone-framework.src';

@Component({
    selector: 'arha-fit-activity',
    templateUrl: './fit.activity.component.html',
    styleUrls: ['./home.component.css']
})

export class FitActivityComponent implements OnInit {

    authState: Observable<firebase.User>;
    fitDataStore: object;

    @ViewChild('activityChart') public chartEl: ElementRef;
    private _chart: any;

    constructor(private arhaLS: ArhaLocalStorageService,
        private authService: ArhaAuthService,
        private fitService: ArhaFitService) {
        this.authState = authService.getAuthStateDetails();
        this.fitDataStore = {};

        HighchartsMore(Highcharts);
        HighchartsGauge(Highcharts);

        //Get af auth status
        this.authState
            .subscribe(result => {
                if (result != null) {
                    //subscribe daily summary
                    this.subscribeToDailySummary();
                }
            });

    }

    ngOnInit() {
    }

    subscribeToDailySummary() {
        this.arhaLS.getMessage().subscribe(
            fitData => {
                if (fitData.hasOwnProperty('gDailySummary')) {
                    let fit = fitData['gDailySummary'];
                    let query = 'com.google.activity.summary';

                    if (fit.hasOwnProperty(query))
                        this.processActivity(query, fit[query]);
                }
            }
        )
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

            colors: ['#512DA8', '#FBC02D', '#E64A19'],

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
                        x: 290 - labelWidth / 2,
                        y: 160
                    };
                }
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
            }
        }

        chartOpts['pane'] = {
            startAngle: 0,
            endAngle: 360,
            background: [{ // Track for Walking
                outerRadius: '112%',
                innerRadius: '88%',
                backgroundColor: Highcharts.Color(chartOpts.colors[0])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }, { // Track for Running
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.Color(chartOpts.colors[1])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }, { // Track for Still
                outerRadius: '62%',
                innerRadius: '38%',
                backgroundColor: Highcharts.Color(chartOpts.colors[2])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }]
        }

        chartOpts['series'] = [{
            name: 'Walking',
            data: [{
                color: chartOpts.colors[0],
                radius: '112%',
                innerRadius: '88%',
                y: 80
            }]
        }, {
            name: 'Running',
            data: [{
                color: chartOpts.colors[1],
                radius: '87%',
                innerRadius: '63%',
                y: 65
            }]
        }, {
            name: 'Still',
            data: [{
                color: chartOpts.colors[2],
                radius: '62%',
                innerRadius: '38%',
                y: 50
            }]
        }]

        if (this.chartEl && this.chartEl.nativeElement) {
            chartOpts.chart = {
                type: 'solidgauge',
                renderTo: this.chartEl.nativeElement
            };
            this._chart = new Highcharts.Chart(chartOpts);
        }

    }

}