import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatTableDataSource} from '@angular/material';
import { Station, FileLocation, Tester } from "../station";
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
  private options: Array<String>;

  //store the new DUT_WIFI_FW_version
  private newDutWifiFwVersion: FileLocation = new FileLocation();
  //store the new DUT BT HCD file
  private newDutBtHcdFile: FileLocation = new FileLocation();

  //store the tester info
  private testerSource: MatTableDataSource<Tester>;
  private testerColumns: Array<String>;
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
      this.testerColumns = ["Model", "IP", "FirmwareVersion"];
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
    this.station.update_time = new Date()
    //update the DUT_BT_HCD_file and DUT_WIFI_FW_version
    let histDutWifiVersion = this.station.DUT_WIFI_FW_version.map(version => version.description);
    let hisDutBtHcdFile = this.station.DUT_BT_HCD_file.map(file => file.description);
    if(this.newDutWifiFwVersion){
      let index = histDutWifiVersion.indexOf(this.newDutWifiFwVersion.description)
      if(index > -1){
        this.station.DUT_WIFI_FW_version[index] = this.newDutWifiFwVersion;
      }
      else{
        this.station.DUT_WIFI_FW_version.unshift(this.newDutWifiFwVersion);
      }
    }
    if(this.newDutBtHcdFile){
      let index = hisDutBtHcdFile.indexOf(this.newDutBtHcdFile.description)
      if(index > -1){
        this.station.DUT_BT_HCD_file[index] = this.newDutBtHcdFile;
      }
      else{
        this.station.DUT_BT_HCD_file.unshift(this.newDutBtHcdFile);
      }
    }
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
              update_time: this.station['update_time']
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
              update_time: this.station['update_time']
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
  //why update data in this way? well, just push data to datasource won't update the table view
  let newData = this.testerSource.data;
  newData.push(new Tester());
  this.testerSource.data = newData;
}

onChangeSheet(event):void {
  this.selectedSheet = event.value;
}

giveSuggestion(event):void {
  if(event.target.id == "DUT_WIFI_FW_version" || event.target.id == "DUT_BT_HCD_file"){
    //extract the historical file data from corresponding field in station
    this.options = this.station[event.target.id].map(file => file.description);
  }
  else
    this.qaSysService.getSuggestion(event.target.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => this.options = response
    )
}

displayWithDescription(file?: FileLocation): String | undefined{
  return file ? file.description : undefined;
}

openLocation(dest){
  let myWindow = window.open("", "_blank");
  myWindow.document.write("<h1>"+ dest +"</h1><p>Please use the path above to access the location that store the corresponding files</p>")
  myWindow.history.pushState(null, null, dest)
}

  ngOnInit() {
    if(this.station['DUT_connection_picture'] && this.station['DUT_connection_picture'] != null){
      let file = this.dataURLtoFile("data:image/png;base64," + this.station.DUT_connection_picture, this.station.id + "_DUT_connection_picture.png");
      this.station.DUT_connection_picture = file;
      this.station.station_picture = this.dataURLtoFile("data:image/png;base64," + this.station.station_picture, this.station.id + "_station_picture.png");
    }
    if(this.station.DUT_BT_HCD_file != null && this.station.DUT_BT_HCD_file.length > 0){
      //deep copy
      this.newDutBtHcdFile = JSON.parse(JSON.stringify(this.station.DUT_BT_HCD_file[0]));
    }
    if(this.station.DUT_WIFI_FW_version != null && this.station.DUT_WIFI_FW_version.length > 0){
      this.newDutWifiFwVersion = JSON.parse(JSON.stringify(this.station.DUT_WIFI_FW_version[0]));
    }
    this.testerSource = new MatTableDataSource(this.station.tester);
    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
