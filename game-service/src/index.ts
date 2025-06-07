import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';

const PORT = process.env.PORT;

if (!PORT) throw new Error('PORT is not defined');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('Hello World');
});

const waitingPlayers: Socket[] = [];
const games = new Map<string, {
    white: Socket,
    black: Socket,
    players: Map<string, Socket>
}>();
const socketToGameId = new Map<string, string>();

io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('leaveGame', () => {
        leaveGame(socket);
        socket.disconnect();
    });

    socket.on('joinGame', (username, callback) => {
        console.log(username);
        socket.data.username = username;

        if (waitingPlayers.length === 0) {
            waitingPlayers.push(socket);
            callback('Waiting for another player...');
        } else {
            callback('Game is about to begin...');
            const opponent = waitingPlayers.shift()!;
            const gameId = `game-${socket.id}-${opponent.id}`;

            const white = Math.random() > 0.5 ? socket : opponent;
            const black = white === socket ? opponent : socket;

            white.join(gameId);
            black.join(gameId);

            games.set(gameId, {
                white,
                black,
                players: new Map([
                    [white.data.username, white],
                    [black.data.username, black]
                ])
            });

            socketToGameId.set(socket.id, gameId);
            socketToGameId.set(opponent.id, gameId);

            white.emit('gameStarted', { color: 'white', opponent: black.data.username });
            black.emit('gameStarted', { color: 'black', opponent: white.data.username });

            console.log(`Game started: ${gameId} between ${white.data.username} and ${black.data.username}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`${socket.data.username} disconnected`);

        const gameId = socketToGameId.get(socket.id);

        if (gameId && games.has(gameId)) {
            leaveGame(socket);
        } else {
            const index = waitingPlayers.findIndex(({ id }) => id === socket.id);
            if (index !== -1) {
                waitingPlayers.splice(index, 1);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log('Server is running on port 3000');
});

function leaveGame(socket: Socket) {
    const gameId = socketToGameId.get(socket.id)!;

    const game = games.get(gameId)!;
    const opponent = game.white.id === socket.id ? game.black : game.white;

    opponent.emit('gameEnded', `${socket.data.username} disconnected from the game`);
    opponent.leave(gameId);

    socketToGameId.delete(socket.id);
    socketToGameId.delete(opponent.id);
    games.delete(gameId);

    console.log(`Game ended: ${gameId}`);
}