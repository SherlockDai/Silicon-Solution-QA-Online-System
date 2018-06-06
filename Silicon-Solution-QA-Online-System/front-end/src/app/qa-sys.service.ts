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
    return this.http.post<Station>(this.getStationUrl, station, this.httpOptions).pipe(map(response => {
      response.timestamp = new Date(response.timestamp);
      if(response.DUT_connection_picture){
      }
      return response;
    }));
  }

  addStation(station: Station): Observable<JSON>{
    let formData = new FormData();
    formData.append("id", station.id);
    formData.append("vender", station.vender);
    formData.append("chipset", station.chipset);
    formData.append("device", station.device);
    formData.append("timestamp", station.timestamp.toDateString())
    formData.append("DUT_name", station.DUT_name);
    formData.append("DUT_HW_version", station.DUT_HW_version);
    formData.append("DUT_WIFI_FW_version", station.DUT_WIFI_FW_version);
    formData.append("DUT_BT_HCD_file", station.DUT_BT_HCD_file);
    formData.append("DUT_username", station.DUT_username);
    formData.append("DUT_password", station.DUT_password);
    formData.append("external_power_supply", station.external_power_supply);
    formData.append("additional_comments", station.additional_comments);
    formData.append("DUT_connection_picture", station.DUT_connection_picture);
    let headers = new HttpHeaders();
    headers.delete('Content-Type');
    let options = { headers: headers };
    return this.http.post<JSON>(this.addStationUrl, formData, options);
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
