import express from 'express';
import { createServer } from 'node:http';

const PORT = process.env.PORT;

if (!PORT) throw new Error('PORT is not defined');

const app = express();
const server = createServer(app);

app.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(PORT, () => {
    console.log('Server is running on port 3000');
});