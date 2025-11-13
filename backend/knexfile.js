// backend/knexfile.js

import dotenv from 'dotenv';
dotenv.config();

const development = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1', 
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'projeto_crud_db',
    port: process.env.DB_PORT || 3306,
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

export default {
  development
};