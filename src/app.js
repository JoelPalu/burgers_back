import express from 'express';
import api from './api/index.js';
import {
  errorHandler,
  notFoundHandler,
  validationErrors,
} from './middlewares/middlewares.js';
import cors from 'cors';
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from "fs";
import * as https from "https";
//Server
// const hostname ='10.120.32.57'
// const port = 80;

//Localhost
const hostname = '127.0.0.1';
const port = 3000;

const app = express();

app.use(cors());

app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1', api);


app.use(notFoundHandler);
app.use(validationErrors);
app.use(errorHandler);


app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


const serverOptions = {
  key: fs.readFileSync('ca.key'),
  cert: fs.readFileSync('ca.cert')
};

https.createServer(serverOptions, app).listen(443, () => {
  console.log('Server running on port 443');
});


export default app;

