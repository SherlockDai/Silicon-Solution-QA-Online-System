import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from "./login-page/login-page.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";
import { InfoSysComponent } from "./info-sys/info-sys.component";
import { LocationPageComponent } from "./location-page/location-page.component";
import { BottomSheetComponent } from "./bottom-sheet/bottom-sheet.component";
import { StationInfoBrief } from "./brief-station";
import { Station } from "./station";
import { DialogPageComponent } from "./dialog-page/dialog-page.component";
import { MatTableDataSource } from "@angular/material";
const stationInfoConfig = {
  briefInfo: StationInfoBrief,
  fullInfo: Station,
  dialog: DialogPageComponent,
  bottomSheet: BottomSheetComponent,
  collection: "stationInfo",
  tableColumns: [
    { columnDef: 'Vender', value: "vender", header: 'Vender', cell: (element: any) => `${element.vender}`     },
    { columnDef: 'Chipset', value: "chipset", header: 'Chipset', cell: (element: any) => `${element.chipset}`   },
    { columnDef: 'Device', value: "device", header: 'Device', cell: (element: any) => `${element.device}`   },
    { columnDef: 'Status', value: "status", header: 'Status', cell: (element: any) => `${element.status}`   },
    { columnDef: 'Date', value: "update_time", header: 'Date', cell: (element: any) => `${(new Date(element.update_time)).toDateString()}`   },
  ],

  pageDataSource: new MatTableDataSource<StationInfoBrief>(),
  fullDataSource: new MatTableDataSource<StationInfoBrief>(),
  favoriateDataSource: new MatTableDataSource<StationInfoBrief>(),
}

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginPageComponent},
  { path: 'home', component: HomePageComponent},
  { path: 'station-info-sys', component: InfoSysComponent, data:stationInfoConfig},
  { path: 'location', component: LocationPageComponent},
  { path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

