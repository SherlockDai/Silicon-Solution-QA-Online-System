import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSysComponent } from './info-sys.component';

describe('StationInfoSysComponent', () => {
  let component: InfoSysComponent;
  let fixture: ComponentFixture<InfoSysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
