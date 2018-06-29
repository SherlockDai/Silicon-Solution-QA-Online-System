import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from './message.service';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, throwError  } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QaSysService {
  //the login api url
  private loginUrl = "http://localhost:3000/login"
  private registerUrl = "http://localhost:3000/register"
  private retrieveUrl = "http://localhost:3000/retrievePassword"
  private getAllUrl = "http://localhost:3000/getAll"
  private addOneUrl = "http://localhost:3000/addOne"
  private getOneUrl = "http://localhost:3000/getOne"
  private deleteOneUrl = "http://localhost:3000/deleteOne"
  private updateOneUrl = "http://localhost:3000/updateOne"
  private getSuggestionUrl = "http://localhost:3000/getSuggestion"
  private checkExistingUrl = "http://localhost:3000/checkExisting"
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(
    private http:HttpClient,
    private messageService: MessageService) { }

  login(email:string, password:string): Observable<JSON>{
    let data = {
      email: email,
      password: password
    }
    return this.http.post<JSON>(this.loginUrl, data, this.httpOptions);
  }

  register(email:string, password: string): Observable<Boolean>{
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
  }

  getAll(collection: string): Observable<any[]>{
    return this.http.post<any[]>(this.getAllUrl, {
      collection: collection,
      option: {
        _id: 0, id: 1, vender: 1, chipset: 1, device: 1, status: 1, update_time: 1
      }
    }, this.httpOptions);
  }

  getOne(record: any, collection: string): Observable<any>{
    return this.http.post<any>(this.getOneUrl, {
        collection: collection,
        fields: {id: record.id},
      }, this.httpOptions).pipe(map(response => {
        //since formdata can only pass string, we have stringfy the tester array, now we need to convert it back
        for(let property in response){
            try {
              response[property] = JSON.parse(response[property])
            } catch (error) {
              continue;
            }
          }
        return response;
      }));
  }

  deleteOne(record: any, collection: String): Observable<Boolean>{
    return this.http.post<Boolean>(this.deleteOneUrl, {
      collection: collection,
      fields: {id: record.id}
    }, this.httpOptions);
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
        if (Array.isArray(record[property])){
          //currently I have to hard code for the documents
          formData.append(property, JSON.stringify(record[property]));
        }
        else{
          formData.append(property, record[property]);
        }
      }
    }
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    let options = { headers: headers };
    return this.http.post<any>(this.addOneUrl, formData, options).pipe(
      catchError(this.errorHandler));
  }

  updateOne(prevInfo: any, record: any, collection: string): Observable<JSON>{
    let formData = new FormData();
    formData.append("prevId", prevInfo.id);
    formData.append("collection", collection);
    for(let property in record){
      if (record.hasOwnProperty(property)) {
        if (property == 'uploads'){
          for (let doc of record[property]){
            formData.append('uploads[]', doc, doc['name'])
          }
        }
        if (Array.isArray(record[property])){
          formData.append(property, JSON.stringify(record[property]));
        }
        else{
          formData.append(property, record[property]);
        }
      }
    }
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    let options = { headers: headers };
    return this.http.post<JSON>(this.updateOneUrl, formData, options);
  }

  //get the distinct values in certain field
  getSuggestion(fieldName: String, collection: string): Observable<Array<String>>{
    let data = {
      collection: collection,
      field: fieldName
    }
    return this.http.post<Array<String>>(this.getSuggestionUrl, data, this.httpOptions);
  }

  private errorHandler(response: HttpErrorResponse){
    return throwError(response.error)
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
