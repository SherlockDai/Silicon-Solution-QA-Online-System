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
  stationImagePath: SafeResourceUrl;
  DUTImagePath: SafeResourceUrl;
  station: Station;
  readOnly: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  private selectedSheet = "general"; 
  //initialize the status list
  private stationStatus = ["inactive", "active", "idle"];
  constructor(public dialogRef: MatDialogRef<DialogPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
      private _sanitizer: DomSanitizer, private qaSysService:QaSysService ) {
      this.station = data["station"];
      this.readOnly = data["action"] == "detail" ? true : false;
      if(this.station.DUT_connection_picture)
        //now the picture attr stores base64 we will convert it to File object in onInit
        this.DUTImagePath ="data:image/png;base64," + this.station.DUT_connection_picture;
      if(this.station.station_picture)
        this.stationImagePath = "data:image/png;base64," + this.station.station_picture;
    }

  onFileChange(event):void {
    let reader = new FileReader()
    if(event.target.files && event.target.files.length) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        if(this.selectedSheet == "general"){
          this.stationImagePath = reader.result
          this.station.station_picture = file;
        }
        else if (this.selectedSheet == "dut"){
          this.DUTImagePath = reader.result;
          this.station.DUT_connection_picture = file;
        }
       };
    }
  }

  onSubmit(event):void {
    this.station.id = this.station.vender + '-' + this.station.chipset + '-' + this.station.device + 'UP';
    //update the update date
    this.station.updateTime = new Date()
    if(this.data.action == "insert"){
      this.qaSysService.addStation(this.station).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => {
          if(response){
            let newBriefStation: StationInfoBrief = {
              id: this.station['id'],
              vender: this.station['vender'],
              chipset: this.station['chipset'],
              device: this.station['device'],
              status: this.station['status'],
              updateTime: this.station['updateTime']
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
              status: this.station['status'],
              updateTime: this.station['updateTime']
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

addTester(event):void {
  this.station.tester.push("");
}

changeTester(event, index):void {
  this.station.tester[index] = event.target.value;
}

onChangeSheet(event):void {
  this.selectedSheet = event.value;
}

  ngOnInit() {
    if(this.station['DUT_connection_picture'] && this.station['DUT_connection_picture'] != null){
      let file = this.dataURLtoFile("data:image/png;base64," + this.station.DUT_connection_picture, this.station.id + "_DUT_connection_picture.png");
      this.station.DUT_connection_picture = file;
      this.station.station_picture = this.dataURLtoFile("data:image/png;base64," + this.station.station_picture, this.station.id + "_station_picture.png");
    }
    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
