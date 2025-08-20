import express from 'express';
import Database from './app/config/Database.js';
import AuthenticationRoutes from './app/routes/routes.js';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();
const app = express();

// Database connection
Database();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// make static folder /uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


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
