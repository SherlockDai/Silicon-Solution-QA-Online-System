import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { StationInfoBrief } from './brief-station';
import { Station } from "./station";
@Injectable({
  providedIn: 'root'
})
export class QaSysService {
  //the login api url
  private loginUrl = "http://localhost:3000/userInfo"
  private allStationUrl = "http://localhost:3000/allStationInfo"
  private addStationUrl = "http://localhost:3000/addStation"
  private getStationUrl = "http://localhost:3000/getStation"
  private deleteStationUrl = "http://localhost:3000/deleteStation"
  private updateStationUrl = "http://localhost:3000/updateStation"
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

  getAllStation(): Observable<StationInfoBrief[]>{
    return this.http.get<StationInfoBrief[]>(this.allStationUrl);
  }

  getStation(station: StationInfoBrief): Observable<Station>{
    return this.http.post<any>(this.getStationUrl, station, this.httpOptions).pipe(map(response => {
      //since formdata can only pass string, we fetched the date string from date object, now we need to convert it back
      response.creationTime = new Date(response.creationTime);
      response.updateTime = new Date(response.updateTime);
      //since formdata can only pass string, we have stringfy the tester array, now we need to convert it back
      response.tester = JSON.parse(response.tester);
      return response;
    }));
  }

  deleteStation(station: StationInfoBrief): Observable<Boolean>{
    return this.http.post<Boolean>(this.deleteStationUrl, station, this.httpOptions);
  }

  addStation(station: Station): Observable<JSON>{
    let formData = new FormData();
    for(let property in station){
      if (station.hasOwnProperty(property)) {
        if (property == "creationTime" || property == "updateTime"){
          formData.append(property, station[property].toDateString());
        }
        else if (property == "tester"){
          formData.append(property, JSON.stringify(station[property]));
        }
        else{
          formData.append(property, station[property]);
        }
      }
    }
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    let options = { headers: headers };
    return this.http.post<JSON>(this.addStationUrl, formData, options);
  }

  updateStation(prevInfo: StationInfoBrief, station: Station): Observable<JSON>{
    let formData = new FormData();
    formData.append("prevId", prevInfo.id)
    for(let property in station){
      if (station.hasOwnProperty(property)) {
        if (property == "creationTime" || property == "updateTime"){
          formData.append(property, station[property].toDateString());
        }
        else{
          formData.append(property, station[property]);
        }
      }
    }
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    let options = { headers: headers };
    return this.http.post<JSON>(this.updateStationUrl, formData, options);
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
