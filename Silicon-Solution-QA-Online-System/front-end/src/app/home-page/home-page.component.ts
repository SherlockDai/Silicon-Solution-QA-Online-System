import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { QaSysService } from "../qa-sys.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('* => in', [
        style({transform: 'translateX(100%)'}),
        animate(400)
      ])
    ]),
    trigger('showUp', [
      state('up', style({transform: 'translateY(0)'})),
      state('down', style({opacity: 1, transform: 'translateY(100%)'})),
      transition('down => up', [
        animate(400)
      ])
    ])
  ]
})
export class HomePageComponent implements OnInit {
  //declare state to store the state of the team info
  state:String;

  constructor(public qaSysService: QaSysService) { 
    //initialize the state to down in order to hide the team info at the begining 
    this.state = 'down';
  }

  ngOnInit() { }

  //function that change the state to up in order to show up the team info
  showUp(): void{
    this.state = 'up';
  }

}
