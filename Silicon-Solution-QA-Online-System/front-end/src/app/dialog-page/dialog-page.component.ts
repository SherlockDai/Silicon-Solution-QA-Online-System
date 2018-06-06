import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Station } from "../station";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QaSysService } from "../qa-sys.service";
import { StationInfoBrief } from "../brief-station";
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
      if(this.station.DUT_connection_picture)
        //now the picture attr stores base64 we will convert it to File object in onInit
        this.imagePath ="data:image/png;base64," + this.station.DUT_connection_picture;
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
    if(this.data.action == "insert"){
      this.qaSysService.addStation(this.station).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => {
          if(response){
            let newBriefStation: StationInfoBrief = {
              id: this.station['id'],
              vender: this.station['vender'],
              chipset: this.station['chipset'],
              device: this.station['device'],
              timestamp: this.station['timestamp']
            };
            this.dialogRef.close(newBriefStation)
          }
        }
      )
    }
    else if(this.data.action == "update"){
      this.qaSysService.updateStation(this.data.prevInfo, this.station).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => {
          if(response){
            let newBriefStation: StationInfoBrief = {
              id: this.station['id'],
              vender: this.station['vender'],
              chipset: this.station['chipset'],
              device: this.station['device'],
              timestamp: this.station['timestamp']
            };
            this.dialogRef.close({prevInfo: this.data.prevInfo, newInfo: newBriefStation})
          }
        }
      )
    }
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

  ngOnInit() {
    if(this.station['DUT_connection_picture'] && this.station['DUT_connection_picture'] != null){
      let file = this.dataURLtoFile("data:image/png;base64," + this.station.DUT_connection_picture, this.station.id + ".png");
      this.station.DUT_connection_picture = file;
    }
    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
