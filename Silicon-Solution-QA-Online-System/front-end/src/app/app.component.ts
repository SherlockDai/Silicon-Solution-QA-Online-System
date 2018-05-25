import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //animations:[ routerTransition ]
})
export class AppComponent implements OnInit{
  /**getState(outlet){
    return outlet.activatedRouteData.state;
  }**/
  constructor(private router: Router) { }
  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
}

}
