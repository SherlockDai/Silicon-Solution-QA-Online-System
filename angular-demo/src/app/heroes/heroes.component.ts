import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from "../hero.service";
import { Observable } from "rxjs";
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes$: Observable<Hero[]>;

  selectedHero: Hero;


  constructor(private heroSerice: HeroService) { }

  ngOnInit() {
    this.heroes$ = this.heroSerice.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

}