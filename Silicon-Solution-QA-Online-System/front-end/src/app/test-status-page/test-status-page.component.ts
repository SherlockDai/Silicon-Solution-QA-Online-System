import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { Test } from "../station";
import { MatSort, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatTableDataSource } from "@angular/material";
import { QaSysService } from "../qa-sys.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-test-status-page',
  templateUrl: './test-status-page.component.html',
  styleUrls: ['./test-status-page.component.css']
})
export class TestStatusPageComponent implements OnInit {

  private mockdata: Array<Test> = [
    {id: "SYSTEMTEST-4013", url: "https://jira.litepoint.internal:8443/browse/SYSTEMTEST-4013", subject: "task", date: 1531415857000, status: "resolved", station_id: "brcm-4357-8UP", readOnly: true},
    {id: "SYSTEMTEST-4012", url: "https://jira.litepoint.internal:8443/browse/SYSTEMTEST-4012", subject: "task", date: 1531343857000, status: "resolved", station_id: "brcm-4357-8UP", readOnly: true},
    {id: "SYSTEMTEST-4011", url: "https://jira.litepoint.internal:8443/browse/SYSTEMTEST-4011", subject: "task", date: 1531178257000, status: "open", station_id: "brcm-4357-8UP", readOnly: true}
  ]

  //control the columns in view model
  private viewColumns = ["id", "subject", "date", "status", "actions"];

  //control the model
  private readOnly = true;

  //store table data
  private dataSource: MatTableDataSource<Test> = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialogRef: MatDialogRef<TestStatusPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _sanitizer: DomSanitizer, private qaSysService:QaSysService,
    private router: Router, public snackBar: MatSnackBar) { }

  getDate(ms){
    return new Date(ms);
  }

  onChangeView(descision){
    this.readOnly = descision;
  }

  editTest(row, event){
    let test = 1;
  }

  ngOnInit() {
    this.dataSource.data = this.mockdata;
    this.dataSource.sort = this.sort;
  }

}
