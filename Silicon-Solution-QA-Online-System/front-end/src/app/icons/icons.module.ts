import { NgModule } from '@angular/core';
import { IconCamera, IconHeart, IconGithub, IconHome, 
  IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, IconSlash, IconFilePlus } from 'angular-feather';
 
const icons = [
  IconSlash,
  IconCamera,
  IconHeart,
  IconGithub,
  IconHome,
  IconPlusSquare,
  IconRefreshCcw,
  IconEdit,
  IconTrash2,
  IconInfo,
  IconFilePlus
];
 
@NgModule({
  exports: icons
})
export class IconsModule { }