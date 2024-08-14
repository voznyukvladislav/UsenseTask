import { Component, OnDestroy } from '@angular/core';
import { CurrenciesService } from 'src/app/services/currencies-service/currencies.service';
import { ListItem } from '../../data/listItem';
import { map, Subscription } from 'rxjs';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnDestroy {
  public form: FormGroup = new FormGroup({
    "baseCurrency": new FormControl()
  });
  
  public list: ListItem[] = [];
  public baseCurrency: string = ""; 

  private currencyCodes$: Subscription = EMPTY_SUBSCRIPTION;
  private baseCurrency$: Subscription = EMPTY_SUBSCRIPTION;
  private baseCurrencySettings$: Subscription = EMPTY_SUBSCRIPTION;

  constructor(private currenciesService: CurrenciesService) {
    this.currencyCodes$ = this.currenciesService.getCodes()
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

      this.baseCurrency$ = this.currenciesService.baseCurrency.subscribe(
        currency => this.baseCurrency = currency
      );

      this.baseCurrencySettings$ = this.form.controls['baseCurrency'].valueChanges.subscribe(newBaseCurrency => this.changeBaseCurrency(newBaseCurrency));
  }

  changeBaseCurrency(code: string) {
    this.currenciesService.changeBaseCurrency(code);
  }

  ngOnDestroy(): void {
    this.currencyCodes$.unsubscribe();
    this.baseCurrency$.unsubscribe();
    this.baseCurrencySettings$.unsubscribe();
  }
}
