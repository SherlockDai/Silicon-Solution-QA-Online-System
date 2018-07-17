import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { ActivatedRoute, Params } from '@angular/router';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.css']
})
export class LocationPageComponent implements OnInit, OnDestroy {

  private route$: Subscription;
  public url: String;

  constructor(private route: ActivatedRoute, public snakeBar: MatSnackBar) { }

  copyToClipboard(): void{
    let snackBarRef = this.snakeBar.open('URL Copied to Clipboard', 'Dismiss');
  }

  ngOnInit() {

    this.route.params.subscribe(
      (params : Params) => {
         this.url = params["url"]; 
      }
   );
  }

  ngOnDestroy() {
        if(this.route$) this.route$.unsubscribe();
    }

}
