import { Component, OnInit, ViewChild } from '@angular/core';
import { QaSysService } from "../qa-sys.service";
import { MatTableDataSource, MatSort, MatSnackBar } from "@angular/material";
import { User } from "../user";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { nearer } from '../../../node_modules/@types/q';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  //collection name
  private collection = "userInfo"
  //control un-subscription
  private ngUnsubscribe: Subject<any> = new Subject();
  //table data source
  public dataSource: MatTableDataSource<User> = new MatTableDataSource
  //data source for the current page
  public pageDataSource: MatTableDataSource<User> = new MatTableDataSource
  //stored data
  private data = null;
  //store the page index
  private currentPage = 0;
  private pageSize = 5;
  private pageLength = 0;
  //matsort
  @ViewChild(MatSort) sort: MatSort;
  //control table columns
  public tableColumns = ["id", "email", "role", "actions"]
  //store previous rows
  private prevRowTable = {}

  constructor(public qaSysService: QaSysService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.qaSysService.getAll({_id: 0}, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.data = response;
        this.dataSource.data = this.data;
        this.pageLength = this.dataSource.data.length;
        this.updatePage();
        this.pageDataSource.sort = this.sort;
      },
      err => {
        this.snackBar.open(err, "Dismiss");
      }
    );
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

  editUser(row, event){
    //allow user to update the corresponding row
    row.readOnly = false;
    //store the previous id in case user update id, then we do know which one to update in back-end
    row.prev_id  = row.id;
    //store the previous data in prevRowTable, the following is a trick for deep copy, be careful of shallow copy
    this.prevRowTable[row.prev_id] = JSON.parse(JSON.stringify(row));
  }

  saveUpdate(row, event){
    //set the readonly attrbiute to true first, otherwise the row's readonly attribute will stored as true in back-end, if error happend set it back to false
    row.readOnly = true
    //if the previous id is null, it means the row is just added
    if (row.prev_id === null){
      //add the new row
      this.qaSysService.addOne(row, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => {
          if (response){
            this.snackBar.open("Insertion successed!", "Dismiss")
            this.updatePage();
          }
          else{
            row.readOnly = false;
            this.snackBar.open("Insertion failed! Please verify your input!", "Dismiss");
          }
        },
        err => {
          this.snackBar.open(err, "Dismiss");
          row.readOnly = false;
        }
      )
    }
    //otherwise we are updating the row
    else{
      //previoud id was stored in the editTest event
      this.qaSysService.updateOne(row.prev_id, row, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => {
          if (response){
            this.snackBar.open("Update successed!", "Dismiss")
            //remove the previous data
            delete this.prevRowTable[row.prev_id]
            this.updatePage();
          }
          else{
            row.readOnly = false;
            this.snackBar.open("Update faled! Please try again later!", "Dismiss")
          }
        },
        err => {
          this.snackBar.open(err, "Dismiss");
          row.readOnly = false;
        }
      )
    }
  }

  discardUpdate(row, event){
    //if the previous id is null, it means the row is just added
    if (row.prev_id === null){
      //simply remove the row from the row table
      let index = this.data.indexOf(row);
      this.data.splice(index, 1);
      this.dataSource.data = this.data;
      this.updatePage();
    }
    //else we are updating the row
    else{
      //here copy the previous stored value to the current row
      const prevRow = this.prevRowTable[row.prev_id];
      for(let k in prevRow) row[k]=prevRow[k];
      //remove the previous data
      delete this.prevRowTable[row.prev_id]
      //change back to view model
      row.readOnly = true;
      this.updatePage();
    }

  }

  deleteUser(row, event){
    this.qaSysService.deleteOne(row.id, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        if (response){
          let index = this.data.indexOf(row);
          this.data.splice(index, 1);
          this.dataSource.data = this.data;
          this.snackBar.open("Deletion successed!", "Dismiss");
          this.updatePage();
        }
        else{
          this.snackBar.open("Deletion failed! Please try again later!", "Dismiss");
        }
      },
      err => {
        this.snackBar.open(err, "Dismiss");
      }
    )
    
  }

  addUser(event): void{
    let newUser = new User();
    this.data.unshift(newUser)
    this.dataSource.data = this.data
    this.updatePage();
  }

}
