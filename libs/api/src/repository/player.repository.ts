import { Socket } from 'socket.io';
import { Username } from '../auth/username.type';

export class PlayerRepository {
  private readonly usernameToSocketMap = new Map<Username, Socket>();

  public add(username: Username, socket: Socket): void {
    this.usernameToSocketMap.set(username, socket);
  }

  public getSocketByUsername(username: Username): Socket | undefined {
    return this.usernameToSocketMap.get(username);
  }

  public getUsernames(): Username[] {
    return this.usernameToSocketMap.keys().toArray();
  }

  public deleteByUsername(username: Username): void {
    this.usernameToSocketMap.delete(username);
  }
}
