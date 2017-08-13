import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { ArhaLocalStorageService } from '../providers/arha.localstorage.service';
import { ArhaAuthService } from '../providers/arha.auth.service';
import { ArhaFitService } from '../providers/arha.fit.service';

@Component({
    selector: 'arha-fit-sleep',
    templateUrl: './fit.sleep.component.html',
    styleUrls: ['./home.component.css']
})

export class FitSleepComponent implements OnInit {

    authState: Observable<firebase.User>;
    fitDataStore: object;

    constructor(private arhaLS: ArhaLocalStorageService,
        private authService: ArhaAuthService,
        private fitService: ArhaFitService) {
        this.authState = authService.getAuthStateDetails();
        this.fitDataStore = {};
        
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
                        this.processSleep(query, fit[query]);
                }
            }
        )
    }

    processSleep(query, fitData) {
        fitData.forEach(element => {
            let activityType = element['value']['0']['intVal'];
            let activityName = this.fitService.getGActivityType(activityType);
            this.fitDataStore[activityName] = {
                'startTimeNanos': element['startTimeNanos'],
                'endTimeNanos': element['endTimeNanos'],
                'count': element['value']['1']['intVal']
            };
        });
    }

}