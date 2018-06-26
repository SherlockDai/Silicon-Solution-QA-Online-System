import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, 
  MatTableDataSource, MatSnackBar} from '@angular/material';
import { Station, FileLocation, Tester, Documnetation } from "../station";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QaSysService } from "../qa-sys.service";
import { StationInfoBrief } from "../brief-station";
import { Router }                 from '@angular/router';
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
    
    //store the document info
    private documentSource: MatTableDataSource<Documnetation>;
    private documentColumns: Array<String>;

    private collection = "stationInfo"
    constructor(public dialogRef: MatDialogRef<DialogPageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, 
        private _sanitizer: DomSanitizer, private qaSysService:QaSysService,
        private router: Router, public snackBar: MatSnackBar) {
        this.station = data["record"];
        this.readOnly = data["action"] == "detail" ? true : false;
        if(this.station.DUT_connection_picture)
          //now the picture attr stores base64 we will convert it to File object in onInit
          this.DUTImagePath = this._sanitizer.bypassSecurityTrustUrl(this.station.DUT_connection_picture);
        if(this.station.station_picture)
          this.stationImagePath = this._sanitizer.bypassSecurityTrustUrl(this.station.station_picture);
        this.testerColumns = ["Model", "IP", "FirmwareVersion"];
        this.documentColumns = ["File", "Size", "Remove"]; 
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
      this.station.update_time = (new Date()).getTime();
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
        this.qaSysService.addOne(this.station, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
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
          },
          err => {
            this.snackBar.open(err, "Dismiss");
          }
        )
      }
      else{
        this.qaSysService.updateOne(this.data.prevInfo, this.station, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
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
      this.qaSysService.getSuggestion(event.target.id, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => this.options = response
      )
  }

  displayWithDescription(file?: FileLocation): String | undefined{
    return file ? file.description : undefined;
  }

  onChangeView(descision){
    this.readOnly = descision;
  }

  openLocation(url): void{
    this.router.navigate(['/location', {url: url}]);
  }

  onFileDrop(files): void{
    for (let file of files){
      this.station.uploads.push(file)
      const result = this.station.documents.filter(function(doc) {
        return doc.name == file.name;
      });
      if (result.length > 0){
        for (let doc of result){
          //first time, the url is null
          doc.url = null;
          //filename must be the same so we just update the size
          doc.size = file.size;
        }
      }
      else
        this.station.documents.push({url: null, name: file.name, size: file.size})
    }
    this.documentSource.data = this.station.documents;
  }

  onFileSelect(event): void {
    if(event.target.files && event.target.files.length) {
      for (let file of event.target.files){
        this.station.uploads.push(file)
        const result = this.station.documents.filter(function(doc) {
          return doc.name == file.name;
        });
        if (result.length > 0){
          for (let doc of result){
            //first time, the url is null
            doc.url = null;
            //filename must be the same so we just update the size
            doc.size = file.size;
          }
        }
        else
          this.station.documents.push({url: null, name: file.name, size: file.size})
      }
      this.documentSource.data = this.station.documents;
    }
  }

  removeDocument(target): void{
    let index = this.station.documents.indexOf(target);
    if (index > -1) {
      // if the url is null it means the removed document is just added, not stored on our backend, 
      // no need to add it to the remove list
      if (this.station.documents[index].url != null){
        this.station.deleted.push(this.station.documents[index]);
      }
      this.station.documents.splice(index, 1);
    }
    for (index = this.station.uploads.length - 1; index >= 0; index--){
      if (this.station.uploads[index].name == target.name){
        this.station.uploads.splice(index, 1);
      }
    }
    this.documentSource.data = this.station.documents;
  }

  ngOnInit() {
    if(this.station['DUT_connection_picture'] && this.station['DUT_connection_picture'] != null){
      let file = this.dataURLtoFile("data:image/png;base64," + this.station.DUT_connection_picture, this.station.id + "_DUT_connection_picture.png");
      this.station.DUT_connection_picture = file;
      this.station.station_picture = this.dataURLtoFile("data:image/png;base64," + this.station.station_picture, this.station.id + "_station_picture.png");
    }
    if(this.station.DUT_BT_HCD_file != null && this.station.DUT_BT_HCD_file.length > 0){
      //deep copy, so that we can bind it to the select element and update it if necessary without affecting the original one
      this.newDutBtHcdFile = JSON.parse(JSON.stringify(this.station.DUT_BT_HCD_file[0]));
    }
    if(this.station.DUT_WIFI_FW_version != null && this.station.DUT_WIFI_FW_version.length > 0){
      this.newDutWifiFwVersion = JSON.parse(JSON.stringify(this.station.DUT_WIFI_FW_version[0]));
    }
    this.testerSource = new MatTableDataSource(this.station.tester);
    this.documentSource = new MatTableDataSource(this.station.documents);
    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
