
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as firebase from 'firebase/app';
import { Headers, RequestOptions } from '@angular/http';
import { ArhaLocalStorageService } from '../providers/arha.localstorage.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ArhaFitService {

  private gFitUrl = 'https://www.googleapis.com/fitness/v1/users/me/';
  private gFitResponse = {};

  constructor(private http: Http,
    private arhaLS: ArhaLocalStorageService) {
  }

  getDataSource(): Observable<any> {
    let dataSourceUrl = 'dataSources';

    return this.http.get(this.gFitUrl + dataSourceUrl, this.getOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDailyDistanceTotal(): Observable<any> {
    let dailyDistanceUrl = 'dataset:aggregate';
    let startDate = new Date();
    let endDate = new Date();

    let dailyDistanceOptions = {
      "aggregateBy": [{
        "dataTypeName": "com.google.distance.delta",
        "dataSourceId": "derived:com.google.distance.delta:com.google.android.gms:pruned_distance"
      }],
      "bucketByTime": { "durationMillis": 86400000 },
      "startTimeMillis": startDate.setHours(0, 0, 0, 0),
      "endTimeMillis": endDate.setHours(23, 59, 0, 0)
    }

    return this.http.get(this.gFitUrl + dailyDistanceUrl, this.getOptionsWithBody(dailyDistanceOptions))
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDailyStepTotal(): Observable<any> {
    let dailyStepUrl = 'dataset:aggregate';
    let startDate = new Date();
    let endDate = new Date();

    let dailyStepOptions = {
      "aggregateBy": [{
        "dataTypeName": "com.google.step_count.delta",
        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
      }],
      "bucketByTime": { "durationMillis": 86400000 },
      "startTimeMillis": startDate.setHours(0, 0, 0, 0),
      "endTimeMillis": endDate.setHours(23, 59, 0, 0)
    }

    return this.http.get(this.gFitUrl + dailyStepUrl, this.getOptionsWithBody(dailyStepOptions))
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivitySegmentTotal(): Observable<any> {
    let dailyStepUrl = 'dataset:aggregate';
    let startDate = new Date();
    let endDate = new Date();

    let dailyStepOptions = {
      "aggregateBy": [{
        "dataTypeName": "com.google.activity.segment",
        "dataSourceId": "derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments"
      }],
      "bucketByTime": { "durationMillis": 86400000 },
      "startTimeMillis": startDate.setHours(0, 0, 0, 0),
      "endTimeMillis": endDate.setHours(23, 59, 0, 0)
    }

    return this.http.get(this.gFitUrl + dailyStepUrl, this.getOptionsWithBody(dailyStepOptions))
      .map(this.extractData)
      .catch(this.handleError);
  }


  getHeader() {
    let token = this.arhaLS.retrieve('gAccessToken');

    let headers = new Headers({
      'Content-Type': 'application/json;encoding=utf-8',
      'Authorization': 'Bearer ' + token
    });

    return headers;
  }

  getOptions() {
    let options = new RequestOptions({ headers: this.getHeader() });

    return options;
  }
  getOptionsWithBody(body) {
    let options = new RequestOptions({ method: 'POST', headers: this.getHeader(), body: body });

    return options;
  }

  private extractData(res: Response) {
    let body = res.json();
    //console.log(body);
    //return body.data || {};
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
