import { NgModule } from '@angular/core';
import { IconCamera, IconHeart, IconGithub, IconHome, 
  IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, IconSlash, IconFilePlus, IconArrowRight } from 'angular-feather';
 
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
  IconFilePlus,
  IconArrowRight
];
 
@NgModule({
  exports: icons
})
export class IconsModule { }