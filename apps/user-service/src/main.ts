import express from 'express';
import router from './router';

const app = express();

app.use('/api', router);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`User-Service Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
