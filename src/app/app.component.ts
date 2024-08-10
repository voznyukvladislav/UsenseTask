import { Component } from '@angular/core';
import { Constants } from './components/data/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UsenseTask';

  constructor() {
    if (!localStorage["baseCurrency"]) {
      localStorage["baseCurrency"] = Constants.baseCurrency;
    }
  }
}
