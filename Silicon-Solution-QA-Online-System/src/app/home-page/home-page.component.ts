import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('* => in', [
        style({transform: 'translateX(100%)'}),
        animate(300)
      ])
    ]),
    trigger('showUp', [
      state('up', style({transform: 'translateY(0)'})),
      state('down', style({opacity: 1, transform: 'translateY(100%)'})),
      transition('down => up', [
        animate(300)
      ])
    ])
  ]
})
export class HomePageComponent implements OnInit {
  state:String;
  constructor(private location: Location) { }

  ngOnInit() {
    this.state = 'down';
  }

  goBack(): void {
    this.location.back();
  }

  showUp(): void{
    this.state = 'up';
  }

}
