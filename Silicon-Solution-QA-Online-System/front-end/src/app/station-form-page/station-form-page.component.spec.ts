import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationFormPageComponent } from './station-form-page.component';

describe('StationFormPageComponent', () => {
  let component: StationFormPageComponent;
  let fixture: ComponentFixture<StationFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
