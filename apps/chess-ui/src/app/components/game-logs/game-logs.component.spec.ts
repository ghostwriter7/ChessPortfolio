import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLogsComponent } from './game-logs.component';

describe('GameLogs', () => {
  let component: GameLogsComponent;
  let fixture: ComponentFixture<GameLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
