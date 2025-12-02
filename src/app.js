import express from 'express';
import api from './api/index.js';
import {
  errorHandler,
  notFoundHandler,
  validationErrors,
} from './middlewares/middlewares.js';
import cors from 'cors';

//Server
// const hostname ='10.120.32.57'
// const port = 80;

//Localhost
const hostname = '127.0.0.1';
const port = 3000;

const app = express();

app.use(cors());
// Serve static files from 'public' and 'uploads' directories. Accessable without authentication
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// Mount API routes under /api/v1.  Maybe for the device its self will be v2 or something.
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

