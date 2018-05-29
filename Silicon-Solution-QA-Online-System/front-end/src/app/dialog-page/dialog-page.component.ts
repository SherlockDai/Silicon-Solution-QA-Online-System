import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Station } from "../station";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-page',
  templateUrl: './dialog-page.component.html',
  styleUrls: ['./dialog-page.component.css']
})
export class DialogPageComponent implements OnInit {
  imagePath: SafeResourceUrl;
  station: Station;
  readOnly: boolean;
  constructor(public dialogRef: MatDialogRef<DialogPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
      private _sanitizer: DomSanitizer) {

      this.station = data["station"];
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.station['DUT_connection_picture']);
      this.readOnly = data["action"] == "update" ? false : true;
    }

  ngOnInit() {

  }

}
