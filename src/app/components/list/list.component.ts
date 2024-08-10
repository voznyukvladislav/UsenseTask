import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from '../data/listItem';
import { ExchangeService } from 'src/app/services/exchange-service/exchange.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() list: ListItem[] = [];
  @Input() item: ListItem = new ListItem();
  @Output() selectCurrency: EventEmitter<string> = new EventEmitter<string>();

  selectedItem: ListItem = new ListItem();

  title: string = "Select currency...";
  
  isOpenedList: boolean = false;

  constructor(private exchangeService: ExchangeService) {
    this.exchangeService.reset.subscribe(
      () => {
        this.selectedItem = new ListItem();
        this.title = "Select currency...";
      }
    );
  }

  ngOnInit(): void {
  }

  select(index: number) {
    this.item = new ListItem();

    this.selectedItem = this.list[index];
    this.title = this.selectedItem.getString();
    this.openClose();

    this.selectCurrency.emit(this.selectedItem.code);
  }

  openClose() {
    this.isOpenedList = !this.isOpenedList;
  }

}
