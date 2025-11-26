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

 app.use((_req, res) => {
   res.status(404).json({ error: 'Not Found' });
 });

 app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
   console.error('Unhandled error:', err);
   const status = typeof err?.status === 'number' ? err.status : 500;
   const message = status === 500 ? 'Internal Server Error' : err?.message || 'Request failed';
   res.status(status).json({ error: message });
 });

export default app;
