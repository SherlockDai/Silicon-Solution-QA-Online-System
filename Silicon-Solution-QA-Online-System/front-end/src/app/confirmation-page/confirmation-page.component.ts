import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.css']
})
export class ConfirmationPageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationPageComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onAction(action): void {
    this.dialogRef.close(action);
  }

}
