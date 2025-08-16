import express from 'express';
import Database from './app/config/Database.js';
import AuthenticationRoutes from './app/routes/routes.js';

import dotenv from 'dotenv';
dotenv.config();

// Database connection
Database();

const app = express();

app.use(express.json());

// Routes

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use("/api",AuthenticationRoutes)

// SERVER PORT
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
