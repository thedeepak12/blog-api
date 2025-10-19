import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../backend/generated/prisma/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

prisma.$connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error: any) => {
    console.error('Database connection error:', error);
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
