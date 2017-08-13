import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { ArhaLocalStorageService } from '../providers/arha.localstorage.service';
import { ArhaAuthService } from '../providers/arha.auth.service';

@Component({
    selector: 'arha-fit-steps',
    templateUrl: './fit.steps.component.html',
    styleUrls: ['./home.component.css']
})

export class FitStepsComponent implements OnInit {

    authState: Observable<firebase.User>;
    fitDataStore: object;

    constructor(private arhaLS: ArhaLocalStorageService,
        private authService: ArhaAuthService, ) {
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
        this.arhaLS.storage.subscribe(
            (fitData) => {
                if (fitData.hasOwnProperty('gDailySummary')) {
                    let fit = fitData['gDailySummary'];
                    let query = 'com.google.step_count.delta';

                    if (fit.hasOwnProperty(query))
                        this.processSteps(query, fit[query]);
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

}