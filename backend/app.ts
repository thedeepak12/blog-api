import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import './config/passport.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import { authenticateJWT } from './middleware/auth.js';

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

app.use('/posts', authenticateJWT, postsRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
