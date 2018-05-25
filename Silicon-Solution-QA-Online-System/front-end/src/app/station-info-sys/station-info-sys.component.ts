import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatBottomSheet} from '@angular/material';
import { BottomSheetComponent } from "../bottom-sheet/bottom-sheet.component";

@Component({
  selector: 'app-station-info-sys',
  templateUrl: './station-info-sys.component.html',
  styleUrls: ['./station-info-sys.component.css']
})
export class StationInfoSysComponent implements OnInit {
  orders: string[];
  displayedColumns: string[];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  constructor(private bottomSheet: MatBottomSheet) { 
    this.displayedColumns = ["Vender", "Chipset", "Devices", "Timestamp"];
    this.orders = ["DESCENDING", "ASCENDING"]
   }

   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent);
  }



  ngOnInit() {
  }
}
export interface StationInfoBrief {
  position: number;
  vender: string;
  chipset: number;
  device: number;
  timestamp: string;
}

const ELEMENT_DATA: StationInfoBrief[] = [
  {position: 1, vender: 'Brcm', chipset: 4357, device: 1, timestamp: "12/2/2017"},
  {position: 2, vender: 'Brcm', chipset: 4324, device: 4, timestamp: "11/2/2017"},
  {position: 3, vender: 'MRVL', chipset: 4313, device: 6, timestamp: "10/2/2017"},
  {position: 4, vender: 'MRVL', chipset: 4355, device: 2, timestamp: "9/2/2017"},
  {position: 5, vender: 'Brcm', chipset: 4335, device: 3, timestamp: "8/2/2017"},
  {position: 6, vender: 'MRVL', chipset: 4356, device: 4, timestamp: "7/2/2017"},
  {position: 7, vender: 'SISO', chipset: 3355, device: 1, timestamp: "6/2/2017"},
  {position: 8, vender: 'SISO', chipset: 4345, device: 2, timestamp: "5/2/2017"},
  {position: 9, vender: 'SISO', chipset: 4865, device: 3, timestamp: "4/2/2017"},
  {position: 10, vender: 'SISO', chipset: 3245, device: 4, timestamp: "3/2/2017"},
];