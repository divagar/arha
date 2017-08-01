
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

  getGActivityType(type) {
    let activityType = [
      "In vehicle",
      "Biking",
      "On foot",
      "Still (not moving)",
      "Unknown (unable to detect activity)",
      "Tilting (sudden device gravity change)",
      null,
      "Walking",
      "Running",
      "Aerobics",
      "Badminton",
      "Baseball",
      "Basketball",
      "Biathlon",
      "Handbiking",
      "Mountain biking",
      "Road biking",
      "Spinning",
      "Stationary biking",
      "Utility biking",
      "Boxing",
      "Calisthenics",
      "Circuit training",
      "Cricket",
      "Dancing",
      "Elliptical",
      "Fencing",
      "Football (American)",
      "Football (Australian)",
      "Football (Soccer)",
      "Frisbee",
      "Gardening",
      "Golf",
      "Gymnastics",
      "Handball",
      "Hiking",
      "Hockey",
      "Horseback riding",
      "Housework",
      "Jumping rope",
      "Kayaking",
      "Kettlebell training",
      "Kickboxing",
      "Kitesurfing",
      "Martial arts",
      "Meditation",
      "Mixed martial arts",
      "P90X exercises",
      "Paragliding",
      "Pilates",
      "Polo",
      "Racquetball",
      "Rock climbing",
      "Rowing",
      "Rowing machine",
      "Rugby",
      "Jogging",
      "Running on sand",
      "Running (treadmill)",
      "Sailing",
      "Scuba diving",
      "Skateboarding",
      "Skating",
      "Cross skating",
      "Inline skating (rollerblading)",
      "Skiing",
      "Back-country skiing",
      "Cross-country skiing",
      "Downhill skiing",
      "Kite skiing",
      "Roller skiing",
      "Sledding",
      "Sleeping",
      "Snowboarding",
      "Snowmobile",
      "Snowshoeing",
      "Squash",
      "Stair climbing",
      "Stair-climbing machine",
      "Stand-up paddleboarding",
      "Strength training",
      "Surfing",
      "Swimming",
      "Swimming (swimming pool)",
      "Swimming (open water)",
      "Table tennis (ping pong)",
      "Team sports",
      "Tennis",
      "Treadmill (walking or running)",
      "Volleyball",
      "Volleyball (beach)",
      "Volleyball (indoor)",
      "Wakeboarding",
      "Walking (fitness)",
      "Nording walking",
      "Walking (treadmill)",
      "Waterpolo",
      "Weightlifting",
      "Wheelchair",
      "Windsurfing",
      "Yoga",
      "Zumba",
      "Diving",
      "Ergometer",
      "Ice skating",
      "Indoor skating",
      "Curling",
      null,
      "Other (unclassified fitness activity)",
      "Light sleep",
      "Deep sleep",
      "REM sleep",
      "Awake (during sleep cycle)"
    ]

    return activityType[type];
  }

  private getHeader() {
    let token = this.arhaLS.retrieve('gAccessToken');

    let headers = new Headers({
      'Content-Type': 'application/json;encoding=utf-8',
      'Authorization': 'Bearer ' + token
    });

    return headers;
  }

  private getOptions() {
    let options = new RequestOptions({ headers: this.getHeader() });

    return options;
  }

  private getOptionsWithBody(body) {
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
