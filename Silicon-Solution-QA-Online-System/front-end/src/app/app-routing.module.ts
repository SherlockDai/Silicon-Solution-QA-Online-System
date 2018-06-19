import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from "./login-page/login-page.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";
import { StationInfoSysComponent } from "./station-info-sys/station-info-sys.component";
import { LocationPageComponent } from "./location-page/location-page.component";
import { StationInfoBrief } from "./brief-station";
import { Station } from "./station";
import { DialogPageComponent } from "./dialog-page/dialog-page.component";
const stationInfoConfig = {
  briefInfo: StationInfoBrief,
  fullInfo: Station,
  dialog: DialogPageComponent,
  collection: "stationInfo",
  tableColumnName: ["No", "Vender", "Chipset", "Devices", "Status", "Date"]
}

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginPageComponent},
  { path: 'home', component: HomePageComponent},
  { path: 'station-info-sys', component: StationInfoSysComponent, data:stationInfoConfig},
  { path: 'location', component: LocationPageComponent},
  { path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

