import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { Test } from "../station";
import { MatSort, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatTableDataSource } from "@angular/material";
import { QaSysService } from "../qa-sys.service";
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-test-status-page',
  templateUrl: './test-status-page.component.html',
  styleUrls: ['./test-status-page.component.css']
})
export class TestStatusPageComponent implements OnInit {

  private mockdata: Array<Test> = [
    {id: "SYSTEMTEST-4013", prev_id: null, url: "https://jira.litepoint.internal:8443/browse/SYSTEMTEST-4013", subject: "task", date: 1531415857000, status: "resolved", station_id: "brcm-4357-8UP", readOnly: true},
    {id: "SYSTEMTEST-4012", prev_id: null, url: "https://jira.litepoint.internal:8443/browse/SYSTEMTEST-4012", subject: "task", date: 1531343857000, status: "resolved", station_id: "brcm-4357-8UP", readOnly: true},
    {id: "SYSTEMTEST-4011", prev_id: null, url: "https://jira.litepoint.internal:8443/browse/SYSTEMTEST-4011", subject: "task", date: 1531178257000, status: "open", station_id: "brcm-4357-8UP", readOnly: true}
  ]

  //control the columns in view model
  private viewColumns = ["id", "subject", "date", "status", "actions"];

  //control the model
  private readOnly = true;

  //store table data
  private dataSource: MatTableDataSource<Test> = new MatTableDataSource();

  //store previous rows
  private prevRowTable = {}

  @ViewChild(MatSort) sort: MatSort;

  //control subscription
  private ngUnsubscribe: Subject<any> = new Subject();

  //the collection string
  private collection = "testStatus"

  //store the input data and station_id
  private data = null;
  private station_id = null;

  constructor(public dialogRef: MatDialogRef<TestStatusPageComponent>,
    @Inject(MAT_DIALOG_DATA) public input: any, 
    private _sanitizer: DomSanitizer, private qaSysService:QaSysService,
    private router: Router, public snackBar: MatSnackBar) {
      this.data = input.data;
      this.station_id = input.station_id;
    }

  getDate(ms){
    return new Date(ms);
  }

  onChangeView(descision){
    this.readOnly = descision;
  }

  editTest(row, event){
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
          }
          else{
            row.readOnly = false;
            this.snackBar.open("Insertion failed! Please verify your input!", "Dismiss");
          }
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
          }
          else{
            row.readOnly = false;
            this.snackBar.open("Update failed! Please verify your input!", "Dismiss");
          }
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
    }

  }

  deleteTest(row, event){
    this.qaSysService.deleteOne(row.id, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        if (response){
          let index = this.data.indexOf(row);
          this.data.splice(index, 1);
          this.dataSource.data = this.data;
          this.snackBar.open("Deletion successed!", "Dismiss");
        }
        else{
          this.snackBar.open("Deletion failed! Please try again later!", "Dismiss");
        }
      }
    )
    
  }

  addTest(){
    let newTest = new Test(this.station_id);
    this.data.push(newTest)
    this.dataSource.data = this.data
  }

  ngOnInit() {
    this.dataSource.data = this.data;
    this.dataSource.sort = this.sort;
  }

}
