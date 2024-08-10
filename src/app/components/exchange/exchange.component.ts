import { Component, OnInit } from '@angular/core';
import { ListItem } from '../data/listItem';
import { CurrenciesService } from 'src/app/services/currencies-service/currencies.service';
import { Subject } from 'rxjs';
import { ExchangeService } from 'src/app/services/exchange-service/exchange.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {

  list: ListItem[] = [];

  conversionRate: number = 0;

  leftValue: number = 0;
  rightValue: number = 0;

  leftCurrencyName: string = "";
  rightCurrencyName: string = "";

  leftCurrency: Subject<string> = new Subject<string>();
  rightCurrency: Subject<string> = new Subject<string>();

  constructor(private currenciesService: CurrenciesService, private exchangeService: ExchangeService) {
    this.currenciesService.getCodes().subscribe(
      (next: any) => {
        for (let i = 0; i < next.supported_codes.length; i++) {
          let item = new ListItem();
          item.code = next.supported_codes[i][0];
          item.name = next.supported_codes[i][1];

          this.list.push(item);
        }
      }
    );

    this.leftCurrency.subscribe(
      name => this.leftCurrencyName = name
    );

    this.rightCurrency.subscribe(
      name => this.rightCurrencyName = name
    );
  }

  selectLeftCurrency(currency: string) {
    this.leftCurrency.next(currency);
    this.updateRight();
  }

  selectRightCurrency(currency: string) {
    this.rightCurrency.next(currency);
    this.updateLeft();
  }

  updateRight() {
    if (!this.leftCurrencyName || !this.rightCurrencyName) return;

    this.currenciesService.latest(`${this.leftCurrencyName}`).subscribe(
      (next: any) => {
        this.conversionRate = next.conversion_rates[`${this.rightCurrencyName}`];
        this.rightValue = this.leftValue * this.conversionRate;
      }
    );
  }

  updateLeft() {
    if (!this.leftCurrencyName || !this.rightCurrencyName) return;

    this.currenciesService.latest(`${this.rightCurrencyName}`).subscribe(
      (next: any) => {
        this.conversionRate = next.conversion_rates[`${this.leftCurrencyName}`];
        this.leftValue = this.rightValue * this.conversionRate;
      }
    );
  }

  reset() {
    this.leftCurrency.next("");
    this.rightCurrency.next("");
    this.leftValue = 0;
    this.rightValue = 0;

    this.exchangeService.reset.next();
  }

  ngOnInit(): void {
  }

}
