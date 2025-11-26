import dotenv from 'dotenv';
dotenv.config();
import app from './config/express.js';
import client from './config/postgres.js';

const PORT = Number(process.env.PORT || 4000);

(async () => {
  try {
    await client.query('SELECT 1');
    console.log('Database connection OK');
    const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
    server.on('error', (err: any) => {
      console.error('HTTP server error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err: any) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
