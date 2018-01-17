import { TestBed, inject } from '@angular/core/testing';

import { PostLoaderService } from './post-loader.service';

describe('PostLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostLoaderService]
    });
  });

  it('should be created', inject([PostLoaderService], (service: PostLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
