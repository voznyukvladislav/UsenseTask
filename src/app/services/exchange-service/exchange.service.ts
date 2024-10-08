import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  public reset: Subject<void> = new Subject();

  constructor() { }
}
