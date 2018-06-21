import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QaSysService {
  //the login api url
  private loginUrl = "http://localhost:3000/login"
  private getAllUrl = "http://localhost:3000/getAll"
  private addOneUrl = "http://localhost:3000/addOne"
  private getOneUrl = "http://localhost:3000/getOne"
  private deleteOneUrl = "http://localhost:3000/deleteOne"
  private updateOneUrl = "http://localhost:3000/updateOne"
  private getSuggestionUrl = "http://localhost:3000/getSuggestion"
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(
    private http:HttpClient,
    private messageService: MessageService) { }

  login(username:string, password:string): Observable<JSON>{
    let data = {
      username: username.toLowerCase(),
      password: password
    }
    let jsonData = JSON.stringify(data)
    return this.http.post<JSON>(this.loginUrl, data, this.httpOptions);
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
    for(let property in record){
      if (record.hasOwnProperty(property)) {
        if (Array.isArray(record[property])){
          formData.append(property, JSON.stringify(record[property]));
        }
        else{
          formData.append(property, record[property]);
        }
      }
    }
    formData.append("collection", collection);
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    let options = { headers: headers };
    return this.http.post<JSON>(this.addOneUrl, formData, options);
  }

  updateOne(prevInfo: any, record: any, collection: string): Observable<JSON>{
    let formData = new FormData();
    formData.append("prevId", prevInfo.id)
    for(let property in record){
      if (record.hasOwnProperty(property)) {
        if (Array.isArray(record[property])){
          formData.append(property, JSON.stringify(record[property]));
        }
        else{
          formData.append(property, record[property]);
        }
      }
    }
    formData.append("collection", collection);
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

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
