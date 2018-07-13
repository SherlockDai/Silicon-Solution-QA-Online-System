import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatDialog } from '@angular/material';
import { QaSysService } from "../qa-sys.service";
import { takeUntil } from '../../../node_modules/rxjs/operators';
import { Subject } from 'rxjs';
import { TestStatusPageComponent } from "../test-status-page/test-status-page.component";

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit {

  //boolean that indicates whether the current table is full table or favorite table
  private isFullList: boolean = true;
  //declare a subject to handle the unsubscription of all subscriptions
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private qaSysService: QaSysService, public dialog: MatDialog) {
      this.isFullList = data['isFullList'];
    }

  ngOnInit() {
  }
  //here return the genrealized actions back to info-sys
  openLink(input: string): void{
    this.bottomSheetRef.dismiss({
      action: input,
      row: this.data['record']
    });
  }

  //customized actions happened in this component
  openTestStatus():void {
    this.qaSysService.getMany({_id: 0}, {station_id: this.data.record.id}, "testStatus").pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        if (response){
          this.dialog.open(TestStatusPageComponent, {
            data: {
              station_id: this.data.record.id,
              data: response
            },
            autoFocus: false
          })
        }
      }
    )
  }

}
