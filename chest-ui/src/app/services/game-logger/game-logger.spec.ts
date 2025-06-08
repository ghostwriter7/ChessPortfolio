import { TestBed } from '@angular/core/testing';

import { GameLogger } from './game-logger';

describe('GameLogger', () => {
  let service: GameLogger;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLogger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
