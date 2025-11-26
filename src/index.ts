import dotenv from 'dotenv';
dotenv.config();
import app from './config/express.js';
import client from './config/postgres.js';

const PORT = Number(process.env.PORT || 4000);

(async () => {
  try {
    await client.query('SELECT 1');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
