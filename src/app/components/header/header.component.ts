import { Component, OnDestroy } from '@angular/core';
import { CurrenciesService } from 'src/app/services/currencies-service/currencies.service';
import { Constants } from '../../data/constants';
import { forkJoin, switchMap, map, Subscription, from, Observable, EMPTY } from 'rxjs';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {

  public isUnderlined: boolean = false;
  public exchangeValues: string[] = [];

  private currencySubscription: Subscription = EMPTY_SUBSCRIPTION;
  private baseCurrency: string = localStorage["baseCurrency"];

  constructor(private currenciesService: CurrenciesService) {
    this.currencySubscription = this.currenciesService.baseCurrency.pipe(
      switchMap(newCurrency => {
        return forkJoin({
          usdRate: this.currenciesService.latest(Constants.usd),
          eurRate: this.currenciesService.latest(Constants.eur)
        })
        .pipe(
          map((results: any) => {
            let usdValue = results.usdRate.conversion_rates[`${newCurrency}`].toFixed(2);
            let eurValue = results.eurRate.conversion_rates[`${newCurrency}`].toFixed(2);
            return [
              `${Constants.usd}: ${usdValue}`,
              `${Constants.eur}: ${eurValue}`
            ];
          })
        );
      })
    ).subscribe(exchangeValues => this.exchangeValues = exchangeValues);
  }

  ngOnDestroy(): void {
    this.currencySubscription.unsubscribe();
  }

  underline() {
    this.isUnderlined = !this.isUnderlined;
  }
}
