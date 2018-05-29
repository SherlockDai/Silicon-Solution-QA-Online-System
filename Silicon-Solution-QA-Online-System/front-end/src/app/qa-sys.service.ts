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
  private loginUrl = "api/users/?username="
  private allStationUrl = "api/briefStations/"
  private stationUrl = "api/stations/?id="

  constructor(
    private http:HttpClient,
    private messageService: MessageService) { }

  login(username:string, password:string): Observable<User>{
    let reg: string = username;
    return this.http.get<User>(this.loginUrl + reg).pipe(
      map(users => users[0]),
      tap(h => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} hero id=${username}`) 
      }),
      catchError(this.handleError<User>(`login username=${username}`))
    );;
  }

  getAllStation(): Observable<StationInfoBrief[]>{
    return this.http.get<StationInfoBrief[]>(this.allStationUrl)
  }

  getStation(): Observable<Station>{
    //todo pass id 
    return this.http.get<Station>(this.stationUrl + "0").pipe(
      map(station => station[0])
    );
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
