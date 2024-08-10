import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeComponent } from './components/exchange/exchange.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  { component: MenuComponent, path: "" },
  { component: ExchangeComponent, path: "exchange" },
  { component: SettingsComponent, path: "settings" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
