import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'express';
import routes from '../routes/index.js';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(json({ limit: '2mb' }));

app.use(routes);

export default app;
