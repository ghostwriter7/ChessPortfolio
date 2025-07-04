import { Username } from '@api';

export type GameId = string;

export type GameMetadata = {
  gameId: GameId;
  black: Username;
  white: Username;
};

export class GameRepository {
  private readonly games = new Map<GameId, GameMetadata>();

  public getGameById(id: GameId): GameMetadata | undefined {
    return this.games.get(id);
  }

  public addGame(id: GameId, metadata: GameMetadata): void {
    this.games.set(id, metadata);
  }
}
