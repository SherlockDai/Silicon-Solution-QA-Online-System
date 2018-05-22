import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('* => in', [
        style({transform: 'translateX(-100%)'}),
        animate(300)
      ])
    ]),
    trigger('expandOut', [
      state('in', style({height: 0, padding: 0}),),
      state('out', style({height: '*'}),),
      transition('in => out', [
        animate(400)
      ])
    ])
  ]
})
export class LoginPageComponent implements OnInit {

  //declare toggle which control the display of registration and login page
  toggle:boolean;
  //declare state which controls the expand animation
  state:String;
  changeForm(){
    this.toggle = !this.toggle;
  }
  //function that change the state in order to trigger the fly animation
  constructor() { }

  ngOnInit() {
    //initialize toggle as true in order to show the login page first 
    this.toggle = true;
    //initialize state as 'in' in order to hide the form first
    this.state = 'in';
  }

  expandOut():void{
    this.state = "out";
  }

}
