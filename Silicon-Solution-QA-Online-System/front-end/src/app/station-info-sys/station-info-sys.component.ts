import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatBottomSheet, MatDialog, 
  MatDialogRef, getMatIconFailedToSanitizeLiteralError} from '@angular/material';
import { BottomSheetComponent } from "../bottom-sheet/bottom-sheet.component";
import { DialogPageComponent } from "../dialog-page/dialog-page.component";
import { QaSysService } from "../qa-sys.service";
import { StationInfoBrief } from "../brief-station";
import {  Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Station } from '../station';
@Component({
  selector: 'app-station-info-sys',
  templateUrl: './station-info-sys.component.html',
  styleUrls: ['./station-info-sys.component.css']
})
export class StationInfoSysComponent implements OnInit, OnDestroy {
  orders: string[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<StationInfoBrief>;
  fullDataSource: MatTableDataSource<StationInfoBrief>;
  favoriateDataSource: MatTableDataSource<StationInfoBrief>;
  loadingInfo = false;
  //set the defaul order to Ascending
  order: string = "ASCENDING";
  sortBase: string;
  //control the Order by component, if the user has not selected sort by, the order by should be disabled
  canSort: boolean = false;
  //declare a subject to handle the unsubscription of all subscriptions
  private ngUnsubscribe: Subject<any> = new Subject();
  //array that stores users favorite station info (brief)
  private favoriteStations: StationInfoBrief[] = [];
  //boolean that identify the current datasource
  private isFullList: boolean = true;

  constructor(private bottomSheet: MatBottomSheet, public dialog: MatDialog, 
    private qaSysService:QaSysService) { 
    this.displayedColumns = ["Position", "Vender", "Chipset", "Device", "Timestamp"];
    this.orders = [ "ASCENDING", "DESCENDING"]
   }

   //filter function
   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.fullDataSource.filter = filterValue;
  }

  //table cell click listener, open bottom sheet
  openBottomSheet(row): void {
    let bottomSHeetRef = this.bottomSheet.open(BottomSheetComponent, {
      data: {
        record: row,
        isFullList: this.isFullList
      }
    });

    bottomSHeetRef.afterDismissed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if(result){
        //open dialog if the user press update or detail info button
        if(result['action'] == "update" || result['action'] == "detail"){
          this.loadingInfo = true;
          this.openDialog(result['action']);
        }
        //add the corresponding station into the favorite list
        else if(result['action'] == "favorite"){
          this.addToFavorite(result['row']);
        }
        else if(result['action'] == "unfavorite"){
          this.deleteFromFavorite(result['row'])
        }
        //todo delete the corresponding station if the user press the delete button
        else if(result['action'] == "delete"){

        }
      }
    })
  }

  //bottom sheet click listener, open dialog
  openDialog(action: string): void{
    let dialogRef;
    this.qaSysService.getStation().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.loadingInfo = false;
        dialogRef = this.dialog.open(DialogPageComponent, {
          data: {
            station: response,
            action: action
          }
        })
      }
    )
  }

  onInsertion(event):void {
    //create a empty station, send it to the dialog page with insertion action
    let newStation:Station = new Station();
    let dialogRef;
    dialogRef = this.dialog.open(DialogPageComponent, {
        data: {
          station: newStation,
          action: "insert"
        }
      }
    );

  }

  onSortChange(value: string):void {
    this.sortBase = value;
    this.canSort = true;
    this.sortData();
  }

  onOrderChange(value: string):void {
    this.order = value;
    this.sortData();
  }

  sortData():void{
    if(this.order === "ASCENDING")
    this.fullDataSource.data = this.fullDataSource.data.sort(this.dynamicSort(this.sortBase))
    else
    this.fullDataSource.data = this.fullDataSource.data.sort(this.dynamicSort("-" + this.sortBase))
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  addToFavorite(station: StationInfoBrief):void {
    this.favoriteStations.push(station);
    this.favoriateDataSource.data = this.favoriteStations;
  }

  deleteFromFavorite(station: StationInfoBrief):void{
    let index = this.favoriteStations.indexOf(station);
    this.favoriteStations.splice(index);
    this.favoriateDataSource.data = this.favoriteStations;
  }

  showFullList():void{
    this.dataSource = this.fullDataSource;
    this.isFullList = true;
  }

  showFavoriteList():void{
    this.dataSource = this.favoriateDataSource;
    this.isFullList = false;
  }

  ngOnInit() {
    //ngOnInit is a better place to fetch data rather than constructor https://angular.io/guide/lifecycle-hooks
    this.qaSysService.getAllStation().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      data => {
        this.fullDataSource = new MatTableDataSource(data);
        this.favoriateDataSource = new MatTableDataSource();
        this.dataSource = this.fullDataSource;
      }
    )
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

