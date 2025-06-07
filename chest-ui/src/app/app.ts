import { Component, OnInit } from "@angular/core";
import { io } from 'socket.io-client';
import { ChessBoard } from './components/chess-board/chess-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    ChessBoard
  ],
  styleUrl: './app.css'
})
export class App implements OnInit {

  public ngOnInit(): void {
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Connected');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    socket.on('waiting', (callback) => {

    })
  }
}
