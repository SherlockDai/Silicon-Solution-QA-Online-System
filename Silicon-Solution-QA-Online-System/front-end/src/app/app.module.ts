import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { Ng2PageScrollModule } from "ng2-page-scroll";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { InfoSysComponent } from './info-sys/info-sys.component';
import { IconsModule } from './icons/icons.module';
import { HttpClientModule }    from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatSelectModule, 
  MatTableModule, MatInputModule, MatPaginatorModule, MatSlideToggleModule,
  MatBottomSheetModule, MatListModule, MatDialogModule, MatProgressBarModule,
  MatSortModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule,
  MatToolbarModule, MatButtonToggleModule, MatAutocompleteModule, MatIconModule } from "@angular/material";
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { DialogPageComponent } from './dialog-page/dialog-page.component';
import { LocationPageComponent } from './location-page/location-page.component';
import { ClipboardModule } from "ngx-clipboard";
import {CdkTableModule} from '@angular/cdk/table';
import { DragAndDropDirective } from './drag-and-drop.directive';
import { ExcelVisualizationComponent } from './excel-visualization/excel-visualization.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    NotFoundPageComponent,
    InfoSysComponent,
    BottomSheetComponent,
    DialogPageComponent,
    LocationPageComponent,
    DragAndDropDirective,
    ExcelVisualizationComponent
  ],
  imports: [
    MatIconModule,
    CdkTableModule,
    ClipboardModule,
    MatAutocompleteModule,
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
    ReactiveFormsModule,
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
