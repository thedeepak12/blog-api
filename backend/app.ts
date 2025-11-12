import express from 'express';
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

const allowedOrigins = process.env.CORS_ORIGINS ? 
  process.env.CORS_ORIGINS.split(',').map(o => o.trim()) : [];

app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    return next();
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

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
