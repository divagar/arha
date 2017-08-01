
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

  getDailySummary(dataTypeName: string): Observable<any> {
    let url = 'dataset:aggregate';
    let startDate = new Date();
    let endDate = new Date();

    let options = {
      "aggregateBy": [{
        "dataTypeName": dataTypeName
      }],
      "bucketByTime": { "durationMillis": 86400000 },
      "startTimeMillis": startDate.setHours(0, 0, 0, 0),
      "endTimeMillis": endDate.setHours(23, 59, 0, 0)
    }

    return this.http.get(this.gFitUrl + url, this.getOptionsWithBody(options))
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
