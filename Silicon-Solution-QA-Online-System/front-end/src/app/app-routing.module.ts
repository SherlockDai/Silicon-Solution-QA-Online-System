import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from "./login-page/login-page.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";
import { InfoSysComponent } from "./info-sys/info-sys.component";
import { LocationPageComponent } from "./location-page/location-page.component";
import { BottomSheetComponent } from "./bottom-sheet/bottom-sheet.component";
import { Station, StationInfoBrief } from "./station";
import { DialogPageComponent } from "./dialog-page/dialog-page.component";
import { MatTableDataSource } from "@angular/material";
import { ExcelVisualizationComponent } from "./excel-visualization/excel-visualization.component";
import { AuthGuard } from "./qa-sys.service";

const stationInfoConfig = {
  briefInfo: StationInfoBrief,
  fullInfo: Station,
  dialog: DialogPageComponent,
  bottomSheet: BottomSheetComponent,
  collection: "stationInfo",
  tableColumns: [
    { columnDef: 'vender', value: "vender", header: 'Vender', cell: (element: any) => `${element.vender}`     },
    { columnDef: 'chipset', value: "chipset", header: 'Chipset', cell: (element: any) => `${element.chipset}`   },
    { columnDef: 'device', value: "device", header: 'Device', cell: (element: any) => `${element.device}`   },
    { columnDef: 'status', value: "status", header: 'Status', cell: (element: any) => `${element.status}`   },
    { columnDef: 'update_time', value: "update_time", header: 'Date', cell: (element: any) => `${(new Date(parseInt(element.update_time))).toDateString()}`   },
  ],            

  pageDataSource: new MatTableDataSource<StationInfoBrief>(),
  fullDataSource: new MatTableDataSource<StationInfoBrief>(),
  favoriateDataSource: new MatTableDataSource<StationInfoBrief>(),
}

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginPageComponent},
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  { path: 'station-info-sys', component: InfoSysComponent, data:stationInfoConfig, canActivate: [AuthGuard]},
  { path: 'location', component: LocationPageComponent, canActivate: [AuthGuard]},
  { path: 'xlsx', component: ExcelVisualizationComponent, canActivate: [AuthGuard]},
  { path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

