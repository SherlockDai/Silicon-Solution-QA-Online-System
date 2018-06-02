import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations'

import { QaSysService } from "../qa-sys.service";
import { Observable, Subject } from 'rxjs';
import { User } from "../user";
import {Router} from '@angular/router';
import { takeUntil } from 'rxjs/operators';
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
export class LoginPageComponent implements OnInit, OnDestroy {

  //declare toggle which control the display of registration and login page
  toggle: boolean;
  //declare state which controls the expand animation
  state: String;
  //decalre loading which controls the loading spinner
  loading: boolean;
  //decalre user to store the user's information
  user: User;

  private ngUnsubscribe: Subject<any> = new Subject();
  changeForm(){
    this.toggle = !this.toggle;
  }
  //function that change the state in order to trigger the fly animation
  constructor(private qaSysService:QaSysService, private router: Router) {
   }

  ngOnInit() {
    //initialize toggle as true in order to show the login page first 
    this.toggle = true;
    //initialize state as 'in' in order to hide the form first
    this.state = 'in';
    //initialize loading to false
    this.loading = false;
  }

  expandOut():void{
    this.state = "out";
  }

  login(username: string, password:string):void{
    this.loading = true;
    
    this.qaSysService.login(username, password).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => this.checkInfo(result));
  }

  checkInfo(result: JSON){
    if(result["result"] == true){
      this.user = result["user"];
      this.router.navigate(['/home']);
    }
    else{
      
    }
    this.loading = false;
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
