import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatBottomSheet, MatDialog, 
  MatDialogRef, getMatIconFailedToSanitizeLiteralError, MatSnackBar} from '@angular/material';
import { QaSysService } from "../qa-sys.service";
import {  Subject, Subscription, Observable, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationPageComponent } from "../confirmation-page/confirmation-page.component";

@Component({
  selector: 'app-info-sys',
  templateUrl: './info-sys.component.html',
  styleUrls: ['./info-sys.component.css'],
})
export class InfoSysComponent implements OnInit, OnDestroy {
  orders: string[];
  displayedColumns: string[];
  columns: Array<any>;
  dataSource;
  pageDataSource;
  fullDataSource;
  favoriateDataSource;
  loadingInfo = false;
  //set the defaul order to Ascending
  order: string = "ASCENDING";
  sortBase: string = "Vender";
  //control the Order by component, if the user has not selected sort by, the order by should be disabled
  canSort: boolean = false;
  //declare a subject to handle the unsubscription of all subscriptions
  private ngUnsubscribe: Subject<any> = new Subject();
  //array that stores users favorite record info (brief)
  private favoriteRecords: any[] = [];
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
  private configuration;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bottomSheet: MatBottomSheet, public dialog: MatDialog, 
    private qaSysService:QaSysService, public snackBar: MatSnackBar, route:ActivatedRoute) { 
    this.configuration = route.snapshot.data
    this.columns = this.configuration.tableColumns;
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.orders = [ "ASCENDING", "DESCENDING"];
    this.fullDataSource = this.configuration.fullDataSource;
    this.pageDataSource = this.configuration.pageDataSource;
    this.dataSource = this.fullDataSource;
    this.favoriateDataSource = this.configuration.favoriateDataSource;
   }

   //filter function
   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.pageDataSource.filter = filterValue;
  }

  //table cell click listener, open bottom sheet
  openBottomSheet(row): void {
    let bottomSHeetRef = this.bottomSheet.open(this.configuration.bottomSheet, {
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
        //add the corresponding record into the favorite list
        else if(result['action'] == "favorite"){
          this.addToFavorite(result['row']);
        }
        else if(result['action'] == "unfavorite"){
          this.deleteFromFavorite(result['row']);
        }
        //todo delete the corresponding record if the user press the delete button
        else if(result['action'] == "delete"){
          this.deleteFromTable(result['row']);
        }
      }
    })
  }

  //bottom sheet click listener, open dialog
  openDialog(action: string, selectedRecord: any): void{
    let dialogRef;
    this.qaSysService.getOne(selectedRecord, this.configuration.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.loadingInfo = false;
        dialogRef = this.dialog.open(this.configuration.dialog, {
          data: {
            record: response,
            action: action,
            prevInfo: selectedRecord
          },
          autoFocus: false
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
              if(index > -1){
                newData[index] = result.newInfo;
                this.favoriateDataSource.data = newData;
              }
            }
            this.updatePage();
            this.snackBar.open("Record is updated!", "Dismiss", {
              duration: 2000
            });
          }
        })
      }
    )
  }

  onInsertion(event):void {
    //create a empty record, send it to the dialog page with insertion action
    let newStation = new this.configuration.fullInfo();
    let dialogRef;
    dialogRef = this.dialog.open(this.configuration.dialog, {
        data: {
          record: newStation,
          action: "insert"
        }
      }
    );
    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if(result){
          //add the returned new record to the record list
          let newData = this.fullDataSource.data;
          newData.push(result);
          this.fullDataSource.data = newData;
          this.snackBar.open("Record is added!", "Dismiss", {
            duration: 2000
          });
          this.updatePage();
        }
      }
    )
  }

  addToFavorite(record: any):void {
    //update favorite list
    this.favoriteRecords.push(record);
    this.favoriateDataSource.data = this.favoriteRecords;
    //update local storage
    this.localStorage.setItem("favoriteStation", JSON.stringify(this.favoriteRecords));
    this.snackBar.open("Record is now in Favorite list!", "Dismiss", {
      duration: 2000
    });
  }

  deleteFromFavorite(record: any):void{
    //update favorite list
    let index = this.favoriteRecords.indexOf(record);
    this.favoriteRecords.splice(index, 1);
    this.favoriateDataSource.data = this.favoriteRecords;
    //update local storage
    this.localStorage.setItem("favoriteStation", JSON.stringify(this.favoriteRecords));
    this.snackBar.open("Record is removed from Favorite List!", "Dismiss", {
      duration: 2000
    });
    this.updatePage();
  }

  deleteFromTable(record: any):void {
    let dialogRef = this.dialog.open(ConfirmationPageComponent);
    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (!result){
        return;  
      }
      //if the user confirm the action, then delete the record from database, remove related files from file system
      this.qaSysService.deleteOne(record, this.configuration.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        result => {
          if (result){
            //remove the record from the list
            let newData = this.fullDataSource.data;
            let index = newData.indexOf(record);
            if(index > -1)
              newData.splice(index, 1);
            this.fullDataSource.data = newData;
            //remove it from favorite if applied
            if(this.favoriateDataSource && this.favoriateDataSource.data.indexOf(record) != -1){
              this.deleteFromFavorite(record);
            }
            this.snackBar.open("Record is deleted!", "Dismiss", {
              duration: 2000
            });
            this.updatePage();
          }
        }
      )
    })
  }

  showFullList():void{
    this.isFullList = true;
    this.currentPage = 0;
    this.updateDataSource()
    this.pageLength = this.dataSource.data.length;
    this.updatePage();
  }

  showFavoriteList():void{
    this.isFullList = false;
    this.currentPage = 0;
    this.updateDataSource()
    this.pageLength = this.dataSource.data.length;
    this.updatePage();
  }

  onRefresh():void {
    this.loadingInfo = true;
    this.qaSysService.getAll(this.configuration.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      data => {
        //update the full table is easy
        this.fullDataSource = new MatTableDataSource(data)
        //update the favorite table takes time
        if (this.favoriateDataSource){
          let prevIds = []
          let newData = []
          this.favoriateDataSource.data.forEach(record => prevIds.push(record.id));
          data.forEach(record => {
            if (prevIds.indexOf(record.id) != -1){
              newData.push(record);
            }
          })
          this.favoriateDataSource.data = newData;
        }
        this.currentPage = 0;
        this.updateDataSource()
        this.updatePage();
        this.loadingInfo = false;
        this.snackBar.open("Table refreshed!", "Dismiss", {
          duration: 2000
        });
      }
    )
  }

  updateDataSource():void {
    if(this.isFullList){
      this.dataSource = this.fullDataSource;
    }
    else{
      this.dataSource = this.favoriateDataSource;
    }
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
    this.updatePage();
  }

  private updatePage() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.dataSource.data.slice(start, end);
    this.pageDataSource.data = part;
  }

  ngOnInit() {
    //ngOnInit is a better place to fetch data rather than constructor https://angular.io/guide/lifecycle-hooks
    this.qaSysService.getAll(this.configuration.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      data => {
        this.fullDataSource.data = data;
        let favoriteData = this.localStorage.getItem('favoriteStation') || "[]";
        this.favoriateDataSource.data = JSON.parse(favoriteData);
        this.dataSource = this.fullDataSource;
        this.pageLength = this.dataSource.data.length;
        this.updatePage();
        this.pageDataSource.sort = this.sort;
      }
    )
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

