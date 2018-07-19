import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations'
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material";

import { QaSysService } from "../qa-sys.service";
import { Subject } from 'rxjs';
import { User } from "../user";
import { Router } from '@angular/router';
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
  user: User = new User();
  //form control for registration
  registEmailFormControl: FormControl;
  registPasswordFormControl: FormControl;
  //form control for login
  loginUsernameFormControl: FormControl;
  loginPasswordFormControl: FormControl
  //store the collection for user info
  collection = "userInfo"
  //control registration checked icon
  registEmailChecked = false;
  registPasswordChecked = false;
  //control un-subscription
  private ngUnsubscribe: Subject<any> = new Subject();

  changeForm(){
    this.toggle = !this.toggle;
  }
  //function that change the state in order to trigger the fly animation
  constructor(private qaSysService:QaSysService, private router: Router, public snackBar: MatSnackBar) {
   }

  ngOnInit() {
    //initialize toggle as true in order to show the login page first 
    this.toggle = true;
    //initialize state as 'in' in order to hide the form first
    this.state = 'in';
    //initialize loading to false
    this.loading = false;
    //initializing form controls
    this.registEmailFormControl = new FormControl();
    this.registPasswordFormControl = new FormControl();
    this.loginUsernameFormControl = new FormControl();
    this.loginPasswordFormControl = new FormControl();
  }

  expandOut():void{
    this.state = "out";
  }

  login(username: string, password:string):void{
    if(username === ""){
      this.loginUsernameFormControl.setErrors({'required': true});
      return;
    }
    if(password === ""){
      this.loginPasswordFormControl.setErrors({'required': true});
      return;
    }
    username = username.toLowerCase();
    this.loading = true;
    this.user.id = username;
    this.qaSysService.login(username, password).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        result => this.checkInfo(result),
        err => this.snackBar.open(err, "Dismiss")
      );
  }

  checkInfo(result: JSON){
    if(result["result"] == true){
      this.router.navigate([this.qaSysService.redirectUrl]);
    }
    else{
        this.loginUsernameFormControl.setErrors({'username': true})
        this.loginPasswordFormControl.setErrors({'password': true})
    }
    this.loading = false;
  }

//the below section is self-implemented login and registration logic, since we use Litepoint credential instead, this part is temporarily abandonded

/*confirmPassword(password: string, confirm_password: string){
    if (password !== confirm_password){
      this.registPasswordFormControl.setErrors({'password-different': true})
      this.registPasswordChecked = false;
    }
    else{
      if (password != ""){
        this.registPasswordChecked = true
      }
    }
  }

  checkEmail(email: string){
    email = email.toLowerCase();
    if(this.validateEmailFormat(email) == false) return;
    this.qaSysService.checkExisting('email', email, this.collection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.registEmailFormControl.setErrors({'email-existing': true})
        this.registEmailChecked = false;
      }
      else{
        this.registEmailChecked = true;
      }
    })
  }

  register(email, password): void{
    this.loading = true;
    if (this.registEmailChecked == false){
      email.focus();
      return;
    }
    if (this.registPasswordChecked == false){
      password.focus();
      return;
    }
     this.qaSysService.register(email.value.toLowerCase(), password.value).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
       if (result){
         this.toggle = !this.toggle;
         this.snackBar.open("Registration successed! A confirmation email will be sent to your email address.", "Dismiss");
       }
       else{
         this.snackBar.open("Registration failed! Please contact administrator! derek.dai@litepoint.com");
       }
       this.loading = false;
     })
  }

  validateEmailFormat(email: string): Boolean{
    if(!email.includes('@litepoint.com')){
      if(!this.toggle){
        this.registEmailFormControl.setErrors({'email-format': true});
      }
      else{
        this.loginEmailFormControl.setErrors({'email-format': true});
      }
      return false;
    }
    return true
  }

  retrievePassword(emailEl): void {
    this.loading = true;
    const email = emailEl.value.toLowerCase();
    if (!email){
      this.loginEmailFormControl.setErrors({'required': true});
    }
    else if (!this.validateEmailFormat(email)){
      this.loginEmailFormControl.setErrors({'email-format': true});
    }
    else{
      this.qaSysService.retrievePassword(email).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result){
          this.snackBar.open("Your password has been sent to your email address!", "Dismiss")
        }
        else{
          this.loginEmailFormControl.setErrors({'email': true});
        }
        this.loading = false;
      })
    }
  } */

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
