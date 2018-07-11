import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material'
import * as XLSX from 'xlsx';
import { Chart } from "angular-highcharts";

type AOA = any[][];
@Component({
  selector: 'app-excel-visualization',
  templateUrl: './excel-visualization.component.html',
  styleUrls: ['./excel-visualization.component.css']
})
export class ExcelVisualizationComponent implements OnInit {
  private files: Array<File> = new Array();
  private tableDataSource: MatTableDataSource<File> = new MatTableDataSource();
  private AnalysisDataSource: MatTableDataSource<File> = new MatTableDataSource();
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
  private dates = [];
  private chart: Chart = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor() { 
    this.tableColumns = ["File", "Last Modified"]
    this.resultColumns = ["brand", "cm", "chipset", "mp", "notes"]
  }

  ngOnInit() {
    this.AnalysisDataSource.sort = this.sort;
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
    this.data = [];
    this.data_account = [];
    this.data_dicts = [];
    this.currentSheet = [];
    this.updates = [];
    this.deletes = [];
    this.inserts = [];
    this.unchanged = [];
    //store the last modified dates in this.dates varialbe, for charts
    for (let index = 0; index < data.length; index++){
      this.dates.push(data[index].lastModified);
    }

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
        let temp_data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
        temp_data['lastModified'] = file.lastModified;
        this.data.push(temp_data);
        if (!--this.count) this.convertData();
      };
      reader.readAsBinaryString(file);
    }
  }

  convertData(): void{
    //sort the data, since the file reader is async, the data might mess up, although it is sorted at the beginging
    this.data.sort(this.dynamicSort("lastModified"))
    for(let record of this.data){
      let metadata = record[1];
      let account_arr = [];
      let dict = {};
      for (let row = 0; row < record.length; row++){
        if (record[row].length == 0 || record[row - 1].length == 0) continue;
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
    this.AnalysisDataSource.data = this.currentSheet;
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
        if (prevAccount && prevAccount.mp == account.mp && prevAccount.notes == account.notes){
          count --;
        }
        else{
          break;
        }
      }
    }
  }

  charts(): void{
    let len = this.data_account.length;
    if (len < 2) return;
    let num_updates = [0]
    let num_inserts = [0]
    let num_deletes = [0]
    for (let index = 0; index < len - 1; index++){
      let lastSheet = this.data_account[index];
      let currentSheet = this.data_account[index + 1];
      let visited = new Set()
      let numu = 0;
      let numi = 0;
      let numd = 0;
      for (let record of currentSheet){
        visited.add(record.id)
        let filter_result = lastSheet.filter(function(acc){
          return acc.id == record.id
        })
        if (filter_result.length > 0){
          //check updates
          //there should be only one previous data
          let prev_record: Account = filter_result[0];
          if (prev_record.mp != record.mp || prev_record.notes != record.notes){
            numu++;
          }
        }
        else{
          numi++;
        }
      }

      for (let record of lastSheet){
        if(!visited.has(record.id)){
          numd++;
        }
      }

      num_updates.push(numu);
      num_inserts.push(numi);
      num_deletes.push(numd);
    }
    let xAxisLabels = this.dates;
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Historial Actions'
      },
      yAxis: {
        title: {
            text: 'Number of Actions'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      xAxis:{
        labels: {
          enabled: true,
          formatter: function() { return (new Date(parseInt(xAxisLabels[this.value]))).toDateString()}
        }
      },
      series:[
        {
          name: 'Updates',
          data: num_updates
        },
        {
          name: 'Insertions',
          data: num_inserts
        },
        {
          name: 'Deletes',
          data: num_deletes
        }
      ]
    })
    
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
