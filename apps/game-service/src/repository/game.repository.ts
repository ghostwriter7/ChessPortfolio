type GameId = string;

type GameMetadata = {
  white: string;
  black: string;
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
