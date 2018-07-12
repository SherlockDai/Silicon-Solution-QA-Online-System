import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStatusPageComponent } from './test-status-page.component';

describe('TestStatusPageComponent', () => {
  let component: TestStatusPageComponent;
  let fixture: ComponentFixture<TestStatusPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestStatusPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
