import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Station } from "../station";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QaSysService } from "../qa-sys.service";
@Component({
  selector: 'app-dialog-page',
  templateUrl: './dialog-page.component.html',
  styleUrls: ['./dialog-page.component.css']
})
export class DialogPageComponent implements OnInit, OnDestroy {
  imagePath: SafeResourceUrl;
  station: Station;
  readOnly: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(public dialogRef: MatDialogRef<DialogPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
      private _sanitizer: DomSanitizer, private qaSysService:QaSysService ) {

      this.station = data["station"];
      this.readOnly = data["action"] == "detail" ? true : false;
    }

  onFileChange(event):void {
    let reader = new FileReader()
    if(event.target.files && event.target.files.length) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePath = reader.result;
       };
      this.station.DUT_connection_picture = file;
    }
  }

  onSubmit(event):void {
    this.station.id = this.station.vender + '-' + this.station.chipset + '-' + this.station.device + 'UP';
    this.qaSysService.addStation(this.station).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        console.log(response);
      }
    )
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
