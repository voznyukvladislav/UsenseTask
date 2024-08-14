import { Component, OnDestroy } from '@angular/core';
import { ListItem } from '../../data/listItem';
import { CurrenciesService } from 'src/app/services/currencies-service/currencies.service';
import { EMPTY, forkJoin, map, Subscription } from 'rxjs';
import { ExchangeService } from 'src/app/services/exchange-service/exchange.service';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnDestroy {

  public form: FormGroup = new FormGroup({
    "leftValue": new FormControl(0),
    "rightValue": new FormControl(0),
    "leftCurrency": new FormControl(),
    "rightCurrency": new FormControl()
  });

  public list: ListItem[] = [];

  private codes$: Subscription = EMPTY_SUBSCRIPTION;
  
  private leftConversionRate: number = 0;
  private rightConversionRate: number = 0;

  private leftCurrency: string = "";
  private rightCurrency: string = "";
  private leftCurrency$: Subscription = EMPTY_SUBSCRIPTION;
  private rightCurrency$: Subscription = EMPTY_SUBSCRIPTION;

  private leftValue$: Subscription = EMPTY_SUBSCRIPTION;
  private rightValue$: Subscription = EMPTY_SUBSCRIPTION;

  constructor(private currenciesService: CurrenciesService, private exchangeService: ExchangeService) {
    this.codes$ = this.currenciesService.getCodes()
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

    this.leftCurrency$ = this.form.controls["leftCurrency"].valueChanges.subscribe(
      newValue => {
        this.leftCurrency = newValue;
        this.updateConversionRates().subscribe(this.updateRight.bind(this));
      } 
    );
    this.rightCurrency$ = this.form.controls["rightCurrency"].valueChanges.subscribe(
      newValue => {
        this.rightCurrency = newValue;
        this.updateConversionRates().subscribe(this.updateLeft.bind(this));
      } 
    );

    this.leftValue$ = this.form.controls["leftValue"].valueChanges.subscribe(
      newValue => {
        this.updateRight();
      }
    );
    this.rightValue$ = this.form.controls["rightValue"].valueChanges.subscribe(
      newValue => {
        this.updateLeft();
      }
    );
  }

  updateLeft() {
    let value = (this.form.controls['rightValue'].value * this.rightConversionRate).toFixed(2);
    this.form.controls['leftValue'].setValue(value, { emitEvent: false });
  }
  updateRight() {
    let value = (this.form.controls['leftValue'].value * this.leftConversionRate).toFixed(2);
    this.form.controls['rightValue'].setValue(value, { emitEvent: false });
  }

  updateConversionRates() {
    if (!this.leftCurrency || !this.rightCurrency) return EMPTY;

    return forkJoin({
      leftRate: 
        this.currenciesService.latest(this.leftCurrency).pipe(
          map((response: any) => {
            return Object.entries(response.conversion_rates).find((rate: any) => rate[0] == this.rightCurrency)
          })
        ),
      rightRate: 
        this.currenciesService.latest(this.rightCurrency).pipe(
          map((response: any) => {
            return Object.entries(response.conversion_rates).find((rate: any) => rate[0] == this.leftCurrency)
          })
        )
    }).pipe(
      map((response: any) => {
        this.leftConversionRate = response.leftRate[1];
        this.rightConversionRate = response.rightRate[1];
      })
    );
  }

  reset() {
    this.form.controls["leftValue"].setValue(0, { emitEvent: false});
    this.form.controls["rightValue"].setValue(0, { emitEvent: false});

    this.exchangeService.reset.next();
    
    this.leftConversionRate = 0;
    this.rightConversionRate = 0;

    this.leftCurrency = "";
    this.rightCurrency = "";
  }

  ngOnDestroy(): void {
    this.codes$.unsubscribe();
    this.leftCurrency$.unsubscribe();
    this.rightCurrency$.unsubscribe();
    this.leftValue$.unsubscribe();
    this.rightValue$.unsubscribe();
  }
}
