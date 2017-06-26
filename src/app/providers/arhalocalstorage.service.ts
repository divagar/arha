import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ArhaLocalStorageService {

  constructor() {
  }

  store(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  retrieve(key) {
    let val =  JSON.parse(localStorage.getItem(key));
    if (!val) throw 'No value found!';
    return val;
  }

}
