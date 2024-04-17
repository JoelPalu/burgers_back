import express from 'express';
import api from './api/index.js';
import {
  errorHandler,
  notFoundHandler,
  validationErrors,
} from './middlewares/middlewares.js';
import cors from 'cors';

const hostname = '127.0.0.1';
const app = express();
const port = 3000;
app.use(cors());

app.use('/public', express.static('public'));

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

export default app;

