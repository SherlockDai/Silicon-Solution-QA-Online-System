import { NgModule } from '@angular/core';
import { IconCamera, IconHeart, IconGithub, IconHome } from 'angular-feather';
 
const icons = [
  IconCamera,
  IconHeart,
  IconGithub,
  IconHome
];
 
@NgModule({
  exports: icons
})
export class IconsModule { }