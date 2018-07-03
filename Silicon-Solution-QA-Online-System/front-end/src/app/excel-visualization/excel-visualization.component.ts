import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material'
import * as XLSX from 'xlsx';
type AOA = any[][];
@Component({
  selector: 'app-excel-visualization',
  templateUrl: './excel-visualization.component.html',
  styleUrls: ['./excel-visualization.component.css']
})
export class ExcelVisualizationComponent implements OnInit {
  private files: Array<File> = new Array();
  private tableDataSource: MatTableDataSource<File> = new MatTableDataSource();
  private tableColumns: Array<String> = [];
  private resultColumns: Array<String> = [];
  private data: Array<AOA> = [];
  private data_account: Array<Array<Account>> = [];
  private data_dicts: Array<Object> = []
  private count = 0;
  private updates = {};
  private deletes = [];
  private inserts = [];
  private currentSheet = [];
  private unchanged = [];
  private showUpdates = false;
  private showDeletes = false;
  private showInserts = false;
  private showUnchanged = false;
  constructor() { 
    this.tableColumns = ["File", "Last Modified"]
    this.resultColumns = ["Brand", "CM", "Chipset", "MP", "Notes"]
  }

  ngOnInit() {
    
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    for(let file of evt.target.files){
      this.files.push(file) ;
    }
    this.tableDataSource.data = this.files.sort(this.dynamicSort("lastModified"));
    
  }

  onFileDrop(files): void{
    for (let file of files){
      this.files.push(file)
    }
    this.tableDataSource.data = this.files.sort(this.dynamicSort("lastModified"));

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

  analyze(): void{
    this.count = this.tableDataSource.data.length;
    let data = this.tableDataSource.data;
    this.tableDataSource.data = [];
    this.files = [];
    //table data is sorted, use it
    for (let file of data){
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data.push((<AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}))));
        if (!--this.count) this.convertData();
      };
      reader.readAsBinaryString(file);
    }
  }

  convertData(): void{
    for(let record of this.data){
      let metadata = record[1];
      let account_arr = [];
      let dict = {};
      for (let row = 2; row < record.length; row++){
        let account: Account = new Account();
        for (let column = 0; column < record[1].length; column++){
          if(metadata[column])
            account[metadata[column].toLowerCase()] = record[row][column];
        }
        account.id = account.brand + '-' + account.cm + '-' + account.chipset;
        account_arr.push(account);
        dict[account.id] = account
      }
      this.data_account.push(account_arr);
      this.data_dicts.push(dict);
    }
    this.currentSheet = this.data_account[this.data_account.length - 1];
    this.checkLatestUpdate()
    this.checkUnchanged()
  }

  checkLatestUpdate():void {
    let len = this.data_account.length;
    if (len < 2) return;
    let lastSheet = this.data_account[len -2];
    let visited = new Set()
    for (let record of this.currentSheet){
      visited.add(record.id)
      let filter_result = lastSheet.filter(function(acc){
        return acc.id == record.id
      })
      if (filter_result.length > 0){
        //check updates
        //there should be only one previous data
        let prev_record: Account = filter_result[0];
        this.updates[record.id] = {mp: 0, notes: 0}
        if (prev_record.mp != record.mp){
          this.updates[record.id].mp = 1
        }
        if (prev_record.notes != record.notes){
          this.updates[record.id].notes = 1
        }
      }
      else{
        this.inserts.push(record)
      }
    }

    for (let record of lastSheet){
      if(!visited.has(record.id)){
        this.deletes.push(record)
      }
    }
    this.currentSheet = this.currentSheet.concat(this.deletes);
  }

  checkUnchanged(): void{
    for (let account of this.currentSheet){
      let count = 3;
      for (let index = this.data_dicts.length - 2; index >= 0 ; index--){
        if (count == 0){
          this.unchanged.push(account)
        }
        let prevAccount = this.data_dicts[index][account.id]
        if (prevAccount.mp == account.mp && prevAccount.notes == account.notes){
          count --;
        }
        else{
          break;
        }
      }
    }
  }


}

export class Account{
  id: string;
  brand: string;
  cm: string;
  chipset: string;
  mp: string;
  notes: string;
  constructor(){
    this.id = ""
    this.brand = ""
    this.cm = ""
    this.chipset = ""
    this.mp = ""
    this.notes = ""
  }
}
