import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>) { }

  ngOnInit() {
  }

  openLink(input: string): void{
    this.bottomSheetRef.dismiss(input);
  }

}
