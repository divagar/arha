import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ArhaLocalStorageService {

  private subject = new Subject<any>();

  constructor() {
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  public store(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    let obj = {};
    obj[key] = val;
    this.subject.next(obj);
  }

  public retrieve(key) {
    let val = JSON.parse(localStorage.getItem(key));
    //if (!val) throw 'No value found!';
    return val;
  }

}
