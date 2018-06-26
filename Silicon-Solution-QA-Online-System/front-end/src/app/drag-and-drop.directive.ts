import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @HostBinding('style.background') private background = '#eee';

  @Output() clicked: EventEmitter<any> = new EventEmitter();
  @Output() fileDropped:EventEmitter<Array<File>> = new EventEmitter();
  constructor() { }

  @HostListener('dragover', ['$event']) onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee'
    //do some stuff
  }

  @HostListener('drop', ['$event']) public onDrop(evt){
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    if(files.length > 0){
      this.background = '#eee'
    }
    this.fileDropped.emit(files);
  }

}
