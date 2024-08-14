import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ListItem } from '../../data/listItem';
import { ExchangeService } from 'src/app/services/exchange-service/exchange.service';
import { Subscription } from 'rxjs';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ListComponent),
    multi: true
  }]
})
export class ListComponent implements OnDestroy, ControlValueAccessor {
  @Input() list: ListItem[] = [];
  @Output() selectCurrency: EventEmitter<string> = new EventEmitter<string>();

  public onChange: any = () => {};
  public onTouch: any = () => {};

  public title: string = "Select currency...";  
  public isOpenedList: boolean = false;

  private reset$: Subscription = EMPTY_SUBSCRIPTION;
  private selectedItem: ListItem = new ListItem();

  constructor(private exchangeService: ExchangeService) {
    this.reset$ = this.exchangeService.reset.subscribe(
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

    // this.selectCurrency.emit(this.selectedItem.code);
    this.onChange(this.selectedItem.code);
  }

  openClose() {
    this.isOpenedList = !this.isOpenedList;
  }

  writeValue(obj: any): void {
    this.selectedItem = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

  ngOnDestroy(): void {
    this.reset$.unsubscribe();
  }
}
