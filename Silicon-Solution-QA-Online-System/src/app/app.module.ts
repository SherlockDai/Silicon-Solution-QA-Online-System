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
import { InMemoryDataService }  from './in-memory-data.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatSelectModule, MatTableModule } from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    NotFoundPageComponent,
    StationInfoSysComponent
  ],
  imports: [
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
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false, delay: 1000 }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
