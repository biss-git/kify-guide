import { TestBed } from '@angular/core/testing';

import { KifuService } from './kifu.service';

describe('KifuService', () => {
  let service: KifuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KifuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
