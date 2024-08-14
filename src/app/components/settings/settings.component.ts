import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrenciesService } from 'src/app/services/currencies-service/currencies.service';
import { ListItem } from '../../data/listItem';
import { Constants } from '../../data/constants';
import { map, Subscription } from 'rxjs';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnDestroy {

  currencyCodesSubscription: Subscription = EMPTY_SUBSCRIPTION;
  baseCurrencySubscription: Subscription = EMPTY_SUBSCRIPTION;

  list: ListItem[] = [];
  selectedItem: ListItem = new ListItem();

  baseCurrency: string = "";

  constructor(private currenciesService: CurrenciesService) {
    this.currencyCodesSubscription = this.currenciesService.getCodes()
      .pipe(
        map((response: any) => {
          return response.supported_codes.map((code: any) => {
            let item = new ListItem();
            item.code = code[0];
            item.name = code[1];

            return item;
          })
        })
      )
      .subscribe(list => this.list = list);

      this.baseCurrencySubscription = this.currenciesService.baseCurrency.subscribe(
        currency => this.baseCurrency = currency
      );
  }

  changeBaseCurrency(code: string) {
    this.currenciesService.changeBaseCurrency(code);
  }

  ngOnDestroy(): void {
    this.currencyCodesSubscription.unsubscribe();
    this.baseCurrencySubscription.unsubscribe();
  }
}
