import { TestBed } from '@angular/core/testing';

import { GameStateStore } from './game-state-store';

describe('GameStateStore', () => {
  let service: GameStateStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
