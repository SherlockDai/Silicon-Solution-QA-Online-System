import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelVisualizationComponent } from './excel-visualization.component';

describe('ExcelVisualizationComponent', () => {
  let component: ExcelVisualizationComponent;
  let fixture: ComponentFixture<ExcelVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
