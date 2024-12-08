import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import https from 'https';
import { readFileSync } from 'fs';

import { PORT } from '#app/config/config.mjs';
import { setupWebSocket } from '#app/services/websocketService.js';
import incomingRouter from '#app/routes/incoming/index.js';

const app = express();

dotenv.config();

app.set('port', PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api/incoming', incomingRouter);

let server;

if (process.env.ENVIRONMENT !== 'dev') {
  // Path to your SSL certificate and private key
  const options = {
    key: readFileSync('/etc/ssl/private/ringassist_io.key'),
    cert: readFileSync('/etc/ssl/certs/ringassist_io.crt'),
    ca: readFileSync('/etc/ssl/certs/ringassist_io.ca-bundle')  // Chain file, if needed
  };

  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

// const server: Server = createServer(app);

server.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);

  console.log(`RingAssist - Voice Client Active`);
});

setupWebSocket(server);

export { app };
