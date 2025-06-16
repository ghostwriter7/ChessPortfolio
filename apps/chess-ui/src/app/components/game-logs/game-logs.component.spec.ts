import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLogs } from './game-logs.component';

describe('GameLogs', () => {
  let component: GameLogs;
  let fixture: ComponentFixture<GameLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(GameLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
