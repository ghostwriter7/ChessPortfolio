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

const waitingSockets: Socket[] = [];
const rooms: { name: string; playerA: Socket, playerB: Socket }[] = []

io.on('connection', (socket) => {
    console.log('New connection');

    const anotherSocket = waitingSockets.pop();

    if (anotherSocket) {
        const name = Date.now().toString();
        socket.join(name);
        anotherSocket.join(name);
        rooms.push({ name, playerA: anotherSocket, playerB: socket });
        io.to(name).emit('startGame', (err, response) => console.log(err, response));
        anotherSocket.emit('yourMove', (err, response) => console.log(err, response));
    } else {
        waitingSockets.push(socket);
        socket.emit('matching', (err, response) => console.log(err, response));
    }

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });


});

server.listen(PORT, () => {
    console.log('Server is running on port 3000');
});