import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationInfoSysComponent } from './station-info-sys.component';

describe('StationInfoSysComponent', () => {
  let component: StationInfoSysComponent;
  let fixture: ComponentFixture<StationInfoSysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationInfoSysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoSysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
