import { Component, OnDestroy } from '@angular/core';
import { ListItem } from '../../data/listItem';
import { CurrenciesService } from 'src/app/services/currencies-service/currencies.service';
import { map, Subject, Subscription } from 'rxjs';
import { ExchangeService } from 'src/app/services/exchange-service/exchange.service';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnDestroy {

  codesSubscription: Subscription = EMPTY_SUBSCRIPTION;
  list: ListItem[] = [];

  conversionRate: number = 0;

  leftValue: number = 0;
  rightValue: number = 0;

  leftCurrencyName: string = "";
  rightCurrencyName: string = "";

  leftCurrencySubscription: Subscription = EMPTY_SUBSCRIPTION;
  rightCurrencySubscription: Subscription = EMPTY_SUBSCRIPTION;

  leftCurrency: Subject<string> = new Subject<string>();
  rightCurrency: Subject<string> = new Subject<string>();

  constructor(private currenciesService: CurrenciesService, private exchangeService: ExchangeService) {
    this.codesSubscription = this.currenciesService.getCodes()
      .pipe(
        map((response: any) => {
          return response.supported_codes.map(
            (code: any) => {
              let item = new ListItem();
              item.code = code[0];
              item.name = code[1];

              return item;
            }
          )
        })
      )
      .subscribe(list => this.list = list);

    this.leftCurrencySubscription = this.leftCurrency.subscribe(
      name => this.leftCurrencyName = name
    );

    this.rightCurrencySubscription = this.rightCurrency.subscribe(
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

  ngOnDestroy(): void {
    this.codesSubscription.unsubscribe();
    this.leftCurrencySubscription.unsubscribe();
    this.rightCurrencySubscription.unsubscribe();
  }
}
