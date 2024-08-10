import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from 'src/app/services/currencies-service/currencies.service';
import { Constants } from '../data/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  baseCurrency: string = localStorage["baseCurrency"];
  isUnderlined: boolean = false;
  exchangeValues: string[] = [];

  constructor(private currenciesService: CurrenciesService) {    
    this.currenciesService.baseCurrency.subscribe(
      newCurrency => {
        this.exchangeValues = [];
        this.currenciesService.latest(Constants.usd).subscribe(
          (next: any) => {
            let value = next.conversion_rates[`${newCurrency}`];
            value = value.toFixed(2);
            this.exchangeValues.push(`${Constants.usd}: ${value}`);

            this.currenciesService.latest(Constants.eur).subscribe(
              (next: any) => {
                let value = next.conversion_rates[`${newCurrency}`];
                value = value.toFixed(2);
                this.exchangeValues.push(`${Constants.eur}: ${value}`);
              }
            );
          }
        );    
        
      }
    );
  }

  ngOnInit(): void {
  }

  underline() {
    this.isUnderlined = !this.isUnderlined;
  }
}
