import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from 'src/app/data/api';
import { Constants } from 'src/app/data/constants';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  baseCurrencyValue: string = localStorage["baseCurrency"];
  baseCurrency: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage["baseCurrency"]);

  constructor(private http: HttpClient) {
    this.baseCurrency.subscribe(
      next => {
        this.baseCurrencyValue = next;
        localStorage["baseCurrency"] = this.baseCurrencyValue;
      } 
    );
  }

  changeBaseCurrency(newCode: string) {
    this.baseCurrencyValue = newCode;
    this.baseCurrency.next(newCode);
    localStorage["baseCurrency"] = newCode;
  }

  getCodes() {
    return this.http.get(`${Api.api}/codes`);
  }

  latest(currency: string) {
    return this.http.get(`${Api.api}/latest/${currency}`);
  }
}
