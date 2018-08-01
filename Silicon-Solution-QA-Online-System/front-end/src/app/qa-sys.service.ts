import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material'
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError  } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '../../node_modules/@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class QaSysService {
  //the login api url
  public server = "http://192.168.0.65:3000/"
  private loginUrl = this.server + "login"
  private registerUrl = this.server + "register"
  private retrieveUrl = this.server + "retrievePassword"
  private getAllUrl = this.server + "getAll"
  private addOneUrl = this.server + "addOne"
  private getOneUrl = this.server + "getOne"
  private getManyUrl = this.server + "getMany"
  private deleteOneUrl = this.server + "deleteOne"
  private updateOneUrl = this.server + "updateOne"
  private getSuggestionUrl = this.server + "getSuggestion"
  private checkExistingUrl = this.server + "checkExisting"
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  //indicate whether the user is logged in or not
  private isLoggedIn = false;

  //getter function for isLoggedIn
  public getLoginState(){
    return this.isLoggedIn;
  }
  
  //store the URL so we can redicrect after logging in
  private redirectUrl: string = '\home'
  
  //getter function for redirectURL
  public getRedirectUrl(): string{
    return this.redirectUrl;
  }
  //setter function for redirectURL
  public setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
  
  //jwt decoder
  private jwtHelper = new JwtHelperService();
  
  //the current user
  public user: User = null;

  constructor(private http:HttpClient) { 
    let token = window.localStorage.getItem('token');
    if (token != null && !this.jwtHelper.isTokenExpired(token)){
      this.isLoggedIn = true;
    }
    let user = window.localStorage.getItem('user');
    if (user != null) this.user = JSON.parse(user);
  }

  login(username:string, password:string): Observable<JSON>{
    let data = {
      id: username,
      password: password
    }
    return this.http.post<JSON>(this.loginUrl, data, this.httpOptions).pipe(tap(val => {
      this.isLoggedIn = val['result'];
      if (this.isLoggedIn){
        window.localStorage.setItem('token', val['token']);
        this.user = val['user'];
        window.localStorage.setItem('user', JSON.stringify(this.user));
      }
    }))
  }

  logout(): void {
    this.isLoggedIn = false;
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
  }

  /* register(email:string, password: string): Observable<Boolean>{
    let data = {
      email: email,
      password: password
    }
    return this.http.post<Boolean>(this.registerUrl, data, this.httpOptions);
  }

  retrievePassword(email: string): Observable<Boolean>{
    let data = {
      email: email
    }
    return this.http.post<Boolean>(this.retrieveUrl, data, this.httpOptions);
  } */

  getAll(option: any, collection: string): Observable<any>{
    return this.http.post<any[]>(this.getAllUrl, {
      collection: collection,
      option: option
    }, this.httpOptions).pipe(catchError(this.errorHandler));
  }

  getMany(option: any, fields: any, collection: string): Observable<any>{
    return this.http.post<any>(this.getManyUrl, {
      collection: collection,
      fields: fields,
      option: option
    }, this.httpOptions).pipe(catchError(this.errorHandler));
  }

  getOne(record: any, collection: string): Observable<any>{
    return this.http.post<any>(this.getOneUrl, {
        collection: collection,
        fields: {id: record.id},
      }, this.httpOptions).pipe(map(response => {
        //since formdata can only pass string, we have stringfy arrays, now we need to convert it back
        for(let property in response){
            try {
              response[property] = JSON.parse(response[property])
            } catch (error) {
              continue;
            }
          }
        return response;
      })).pipe(catchError(this.errorHandler));
  }

  deleteOne(id: any, collection: String): Observable<any>{
    return this.http.post<Boolean>(this.deleteOneUrl, {
      collection: collection,
      fields: {id: id}
    }, this.httpOptions).pipe(
      catchError(this.errorHandler));;
  }

  addOne(record: any, collection: string): Observable<JSON>{
    let formData = new FormData();
    formData.append("collection", collection);
    for(let property in record){
      if (record.hasOwnProperty(property)) {
        if (property == 'uploads'){
          for (let doc of record[property]){
            formData.append('uploads[]', doc, doc['name'])
          }
        }
        //stringify all property and parse them on backend
        //exlcude File object
        if (record[property] && typeof record[property].name == 'string'){
          formData.append(property, record[property]);
        }
        else
          formData.append(property, JSON.stringify(record[property]));
      }
    }
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    let options = { headers: headers };
    return this.http.post<any>(this.addOneUrl, formData, options).pipe(
      catchError(this.errorHandler));
  }

  updateOne(prevId: any, record: any, collection: string): Observable<any>{
    let formData = new FormData();
    formData.append("prevId", prevId);
    formData.append("collection", collection);
    for(let property in record){
      if (record.hasOwnProperty(property)) {
        if (property == 'uploads'){
          for (let doc of record[property]){
            formData.append('uploads[]', doc, doc['name'])
          }
        }
        //stringify all property and parse them on backend
        //exlcude File object
        if (typeof record[property].name == 'string'){
          formData.append(property, record[property]);
        }
        else
          formData.append(property, JSON.stringify(record[property]));
      }
    }
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    let options = { headers: headers };
    return this.http.post<JSON>(this.updateOneUrl, formData, options).pipe(
      catchError(this.errorHandler));
  }

  //get the distinct values in certain field
  getSuggestion(fieldName: String, collection: string): Observable<Array<String>>{
    let data = {
      collection: collection,
      field: fieldName
    }
    return this.http.post<Array<String>>(this.getSuggestionUrl, data, this.httpOptions);
  }

  errorHandler(response: HttpErrorResponse){
    if(response.status == 400)
      return throwError(response.error);
    else
      console.log(response);
      return throwError("Sorry, the server is temporarily down! Please try again later or contact the administrator. ");
  }

  checkExisting(fieldName: string, fieldValue: string , collection: string): Observable<Boolean>{
    let data = {
      collection: collection,
      field: {}
    }
    data.field[fieldName] = fieldValue;
    return this.http.post<Boolean>(this.checkExistingUrl, data, this.httpOptions);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private qaSysService: QaSysService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    let url:string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean{
    if (this.qaSysService.getLoginState()) return true;

    //not logged in
    //store the attempted URL for redirecting
    this.qaSysService.setRedirectUrl(url);

    //navigate to the login page 
    this.router.navigate(['/login']);
  }

}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private qaSysService: QaSysService, private router: Router, private snackBar: MatSnackBar) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{

    return this.checkRole();
  }

  checkRole(): boolean{
    if (this.qaSysService.user.role == 'admin') return true;

    //not admin]
    //navigate to the hone page 
    this.router.navigate(['/home']);
    this.snackBar.open("Sorry, you do not have access toward Admin Page! Please contact administrators!", "Dismiss", {
      duration: 3000
    });
  }

}

