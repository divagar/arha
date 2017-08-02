import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ArhaLocalStorageService {

  private storageObserver: any;
  public storage: any;

  constructor() {
    this.storage = Observable.create(observer => {
      this.storageObserver = observer;
    });
  }

  public store(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    if(this.storageObserver != undefined)
      this.storageObserver.next({key, val});
  }

  public retrieve(key) {
    let val = JSON.parse(localStorage.getItem(key));
    //if (!val) throw 'No value found!';
    return val;
  }

}
