
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

  refreshAccessToken(apiKey: string, refreshToken: string): Observable<any> {
    // let url = 'https://www.googleapis.com/oauth2/v4/token';
    // let headers = new Headers({
    //   'Content-Type': 'application/json;encoding=utf-8'
    // });
    // //let data = { 'refresh_token': refreshToken, 'grant_type': 'refresh_token'};
    // let data = { 'code': this.arhaLS.retrieve('gIdToken'), 'grant_type': 'authorization_code'};
    // let options = new RequestOptions({ headers: headers });
    // return this.http.post(url, data, options)
    //   .map(this.extractData)
    //   .catch(this.handleError);
    let url = 'https://securetoken.googleapis.com/v1/token?key='+ apiKey;
    let headers = new Headers({
      'Content-Type': 'application/json;encoding=utf-8'
    });
    let data = { 'refresh_token': refreshToken, 'grant_type': 'refresh_token'};
    //let data = { 'code': this.arhaLS.retrieve('gIdToken'), 'grant_type': 'authorization_code' };
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDataSource(): Observable<any> {
    let token = this.arhaLS.retrieve('gAccessToken');
    let dataSourceUrl = 'dataSources';
    let headers = new Headers({
      'Content-Type': 'application/json;encoding=utf-8',
      'Authorization': 'Bearer ' + token
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.gFitUrl + dataSourceUrl, options)
      .map(this.extractData)
      .catch(this.handleError);
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