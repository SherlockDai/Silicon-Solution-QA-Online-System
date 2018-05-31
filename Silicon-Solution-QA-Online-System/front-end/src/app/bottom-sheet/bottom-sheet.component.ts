import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit {

  //boolean that indicates whether the current table is full table or favorite table
  private isFullList: boolean = true;

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
      this.isFullList = data['isFullList'];
    }

  ngOnInit() {
  }

  openLink(input: string): void{
    this.bottomSheetRef.dismiss({
      action: input,
      row: this.data['record']
    });
  }

}
