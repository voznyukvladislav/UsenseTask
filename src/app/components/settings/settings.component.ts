import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from 'src/app/services/currencies-service/currencies.service';
import { ListItem } from '../data/listItem';
import { Constants } from '../data/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  list: ListItem[] = [];
  selectedItem: ListItem = new ListItem();

  constructor(private currenciesService: CurrenciesService) {
    this.currenciesService.getCodes().subscribe(
      (next: any) => {
        for (let i = 0; i < next.supported_codes.length; i++) {
          let item = new ListItem();
          item.code = next.supported_codes[i][0];
          item.name = next.supported_codes[i][1];

          this.list.push(item);

          if (next.supported_codes[i][0] == localStorage["baseCurrency"]) {
            this.selectedItem = new ListItem();
            this.selectedItem.code = next.supported_codes[i][0];
            this.selectedItem.name = next.supported_codes[i][1];
          }
        }
      }
    );
  }

  changeBaseCurrency(code: string) {
    this.currenciesService.baseCurrency.next(code);
    localStorage["baseCurrency"] = code;
  }

  ngOnInit(): void {
  }
}
