import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatBottomSheet, MatDialog, MatDialogRef, getMatIconFailedToSanitizeLiteralError} from '@angular/material';
import { BottomSheetComponent } from "../bottom-sheet/bottom-sheet.component";
import { DialogPageComponent } from "../dialog-page/dialog-page.component";
import { QaSysService } from "../qa-sys.service";
import { StationInfoBrief } from "../brief-station";
@Component({
  selector: 'app-station-info-sys',
  templateUrl: './station-info-sys.component.html',
  styleUrls: ['./station-info-sys.component.css']
})
export class StationInfoSysComponent implements OnInit {
  orders: string[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<StationInfoBrief>;
  loadingInfo = false;
  constructor(private bottomSheet: MatBottomSheet, public dialog: MatDialog, 
    private qaSysService:QaSysService) { 
    this.displayedColumns = ["Vender", "Chipset", "Devices", "Timestamp"];
    this.orders = ["DESCENDING", "ASCENDING"]
   }

   //filter function
   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  //table cell click listener, open bottom sheet
  openBottomSheet(): void {
    let bottomSHeetRef = this.bottomSheet.open(BottomSheetComponent);

    bottomSHeetRef.afterDismissed().subscribe(result => {
      if(result){
        this.loadingInfo = true;
        this.openDialog(result);
      }
    })
  }

  //bottom sheet click listener, open dialog
  openDialog(action: string): void{
    let dialogRef;
    this.qaSysService.getStation().subscribe(
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



  ngOnInit() {
    this.qaSysService.getAllStation().subscribe(
      data => this.dataSource = new MatTableDataSource(data)
    )
  }
}

