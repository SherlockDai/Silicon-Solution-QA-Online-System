import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatBottomSheet, MatDialog, 
  MatDialogRef, getMatIconFailedToSanitizeLiteralError, MatSnackBar} from '@angular/material';
import { BottomSheetComponent } from "../bottom-sheet/bottom-sheet.component";
import { DialogPageComponent } from "../dialog-page/dialog-page.component";
import { QaSysService } from "../qa-sys.service";
import { StationInfoBrief } from "../brief-station";
import {  Subject, Subscription, Observable, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Station } from '../station';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-station-info-sys',
  templateUrl: './station-info-sys.component.html',
  styleUrls: ['./station-info-sys.component.css'],
})
export class StationInfoSysComponent implements OnInit, OnDestroy {
  orders: string[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<StationInfoBrief>;
  pageDataSource: MatTableDataSource<StationInfoBrief>;
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
  //localstorage that stores users' favorite stations
  private localStorage = window.localStorage;
  //timer which is a observable subscriber with a interval
  private timer: Subscription;
  //store the page info
  private currentPage = 0;
  private pageSize = 5;
  private array: any;
  private pageLength = 0;

  constructor(private bottomSheet: MatBottomSheet, public dialog: MatDialog, 
    private qaSysService:QaSysService, public snackBar: MatSnackBar) { 
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
          this.openDialog(result['action'], result['row']);
        }
        //add the corresponding station into the favorite list
        else if(result['action'] == "favorite"){
          this.addToFavorite(result['row']);
        }
        else if(result['action'] == "unfavorite"){
          this.deleteFromFavorite(result['row']);
        }
        //todo delete the corresponding station if the user press the delete button
        else if(result['action'] == "delete"){
          this.deleteFromTable(result['row']);
        }
      }
    })
  }

  //bottom sheet click listener, open dialog
  openDialog(action: string, selectedRecord: StationInfoBrief): void{
    let dialogRef;
    this.qaSysService.getStation(selectedRecord).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.loadingInfo = false;
        dialogRef = this.dialog.open(DialogPageComponent, {
          data: {
            station: response,
            action: action,
            prevInfo: selectedRecord
          }
        })
        dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          //only update action return result
          if(result){
            let newData = this.fullDataSource.data;
            let index = newData.indexOf(result.prevInfo);
            newData[index] = result.newInfo;
            this.fullDataSource.data = newData;
            //update the favorite as well if applied
            if(this.favoriateDataSource){
              newData = this.favoriateDataSource.data;
              index = newData.indexOf(result.prevInfo);
              newData[index] = result.newInfo;
              this.favoriateDataSource.data = newData;
            }
            this.snackBar.open("Station is updated!", "Dismiss", {
              duration: 2000
            });
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
    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if(result){
        //add the returned new station to the station list
        let newData = this.fullDataSource.data;
        newData.push(result);
        this.fullDataSource.data = newData;
        this.snackBar.open("Station is added!", "Dismiss", {
          duration: 2000
        });
        this.iterator();
      }
    })

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
    this.dataSource.data = this.dataSource.data.sort(this.dynamicSort(this.sortBase))
    else
    this.dataSource.data = this.dataSource.data.sort(this.dynamicSort("-" + this.sortBase))
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
    //update favorite list
    this.favoriteStations.push(station);
    this.favoriateDataSource.data = this.favoriteStations;
    //update local storage
    this.localStorage.setItem("favoriteStation", JSON.stringify(this.favoriteStations));
    this.snackBar.open("Station is now in Favorite list!", "Dismiss", {
      duration: 2000
    });
  }

  deleteFromFavorite(station: StationInfoBrief):void{
    //update favorite list
    let index = this.favoriteStations.indexOf(station);
    this.favoriteStations.splice(index, 1);
    this.favoriateDataSource.data = this.favoriteStations;
    //update local storage
    this.localStorage.setItem("favoriteStation", JSON.stringify(this.favoriteStations));
    this.snackBar.open("Station is removed from Favorite List!", "Dismiss", {
      duration: 2000
    });
    this.iterator();
  }

  deleteFromTable(station: StationInfoBrief):void {
    this.qaSysService.deleteStation(station).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      result => {
        if (result){
          //remove the station from the list
          let newData = this.fullDataSource.data;
          let index = newData.indexOf(station);
          if(index > -1)
            newData.splice(index, 1);
          this.fullDataSource.data = newData;
          //remove it from favorite if applied
          if(this.favoriateDataSource && this.favoriateDataSource.data.indexOf(station) != -1){
            this.deleteFromFavorite(station);
          }
          this.snackBar.open("Station is deleted!", "Dismiss", {
            duration: 2000
          });
          this.iterator();
        }
      }
    )
  }

  showFullList():void{
    this.dataSource = this.fullDataSource;
    this.isFullList = true;
    this.currentPage = 0;
    this.pageLength = this.dataSource.data.length;
    this.iterator();
  }

  showFavoriteList():void{
    this.dataSource = this.favoriateDataSource;
    this.isFullList = false;
    this.currentPage = 0;
    this.pageLength = this.dataSource.data.length;
    this.iterator();
  }

  onRefresh():void {
    this.loadingInfo = true;
    this.qaSysService.getAllStation().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      data => {
        //update the full table is easy
        this.fullDataSource = new MatTableDataSource(data)
        //update the favorite table takes time
        if (this.favoriateDataSource){
          let prevIds = []
          let newData = []
          this.favoriateDataSource.data.forEach(station => prevIds.push(station.id));
          data.forEach(station => {
            if (prevIds.indexOf(station.id) != -1){
              newData.push(station);
            }
          })
          this.favoriateDataSource.data = newData;
        }
        this.currentPage = 0;
        this.iterator();
        this.loadingInfo = false;
        this.snackBar.open("Table refreshed!", "Dismiss", {
          duration: 2000
        });
      }
    )
  }

  onAutoFreshChange(event):void {
    if(event.checked){
      //set up the timer
      this.timer = interval(5 * 1000).subscribe( () => {
        this.onRefresh();
      })
    }
    else{
      this.timer.unsubscribe();
    }
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.dataSource.data.slice(start, end);
    this.pageDataSource.data = part;
  }

  ngOnInit() {
    //ngOnInit is a better place to fetch data rather than constructor https://angular.io/guide/lifecycle-hooks
    this.qaSysService.getAllStation().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      data => {
        this.fullDataSource = new MatTableDataSource(data);
        this.favoriateDataSource = new MatTableDataSource(JSON.parse(this.localStorage.getItem('favoriteStation')));
        this.dataSource = this.fullDataSource;
        this.pageLength = this.dataSource.data.length;
        this.pageDataSource = new MatTableDataSource();
        this.iterator();
      }
    )
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

