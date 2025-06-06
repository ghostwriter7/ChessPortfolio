import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const PORT = process.env.PORT;

if (!PORT) throw new Error('PORT is not defined');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('Hello World');
});

io.on('connection', (socket) => {
    console.log('New connection');
});

server.listen(PORT, () => {
    console.log('Server is running on port 3000');
});