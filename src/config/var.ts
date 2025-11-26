import dotenv from 'dotenv';
dotenv.config();

export const env = process.env.NODE_ENV;
export const port = process.env.PORT;
export const db = process.env.NODE_ENV === 'development' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD;
export const jwtSecret = process.env.JWT_SECRET;