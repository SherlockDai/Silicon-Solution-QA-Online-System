import { TestBed, inject } from '@angular/core/testing';

import { QaSysService } from './qa-sys.service';

describe('QaSysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QaSysService]
    });
  });

  it('should be created', inject([QaSysService], (service: QaSysService) => {
    expect(service).toBeTruthy();
  }));
});
