import { NgModule } from '@angular/core';
import { IconCamera, IconHeart, IconGithub, IconHome, 
  IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, 
  IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud,
  IconXCircle, IconCheck, IconActivity } from 'angular-feather';
 
const icons = [
  IconActivity,
  IconCheck,
  IconXCircle,
  IconUploadCloud,
  IconClipboard,
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