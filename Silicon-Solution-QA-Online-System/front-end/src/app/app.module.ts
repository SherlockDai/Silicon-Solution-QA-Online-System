import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { Ng2PageScrollModule } from "ng2-page-scroll";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { StationInfoSysComponent } from './station-info-sys/station-info-sys.component';
import { IconsModule } from './icons/icons.module';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatSelectModule, 
  MatTableModule, MatInputModule, MatPaginatorModule, MatSlideToggleModule,
  MatBottomSheetModule, MatListModule, MatDialogModule, MatProgressBarModule,
  MatSortModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule,
  MatToolbarModule, MatButtonToggleModule } from "@angular/material";
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { DialogPageComponent } from './dialog-page/dialog-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    NotFoundPageComponent,
    StationInfoSysComponent,
    BottomSheetComponent,
    DialogPageComponent
  ],
  imports: [
    MatButtonToggleModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSortModule,
    MatProgressBarModule,
    MatDialogModule,
    MatListModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    Ng2PageScrollModule,
    BrowserAnimationsModule,
    IconsModule,
    HttpClientModule,
  ],
  entryComponents:[BottomSheetComponent, DialogPageComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
