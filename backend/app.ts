import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import './config/passport.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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

app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
