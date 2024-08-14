import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ListItem } from '../../data/listItem';
import { ExchangeService } from 'src/app/services/exchange-service/exchange.service';
import { Subscription } from 'rxjs';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnDestroy {
  @Input() list: ListItem[] = [];
  @Output() selectCurrency: EventEmitter<string> = new EventEmitter<string>();

  resetSubscription: Subscription = EMPTY_SUBSCRIPTION;

  selectedItem: ListItem = new ListItem();

  title: string = "Select currency...";
  
  isOpenedList: boolean = false;

  constructor(private exchangeService: ExchangeService) {
    this.resetSubscription = this.exchangeService.reset.subscribe(
      () => {
        this.selectedItem = new ListItem();
        this.title = "Select currency...";
      }
    );
  }

  select(index: number) {
    this.selectedItem = this.list[index];
    this.title = this.selectedItem.getString();
    this.openClose();

    this.selectCurrency.emit(this.selectedItem.code);
  }

  openClose() {
    this.isOpenedList = !this.isOpenedList;
  }

  ngOnDestroy(): void {
    this.resetSubscription.unsubscribe();
  }
}
