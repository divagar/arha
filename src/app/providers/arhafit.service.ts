
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ArhaFitService {

  private gFitUrl = 'https://www.googleapis.com/fitness/v1/users/me/';
  private gFitResponse = {};

  constructor(private http: Http) { }

  getDataSource(token: string): Observable<any> {
    let dataSourceUrl = 'dataSources'
    console.log('I am here @ getDataSource');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', token);
    console.log(headers);
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.gFitUrl + dataSourceUrl, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body.data || {};
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
