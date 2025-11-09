import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from 'passport';
import prisma from '../prisma/client.js';
import { authenticateJWT } from '../middleware/auth.js';

type UserPayload = {
  id: string;
  isAdmin?: boolean;
};

declare global {
  namespace Express {
    interface User {
      id: string;
      isAdmin?: boolean;
    }
    
    interface Request {
      user?: User;
    }
  }
}

const authenticateAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate('jwt', { session: false }, (err: Error | null, user?: UserPayload) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const router = express.Router();

router.get('/', authenticateAdmin, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: req.user.id
      },
      include: { 
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        } 
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });
    
    return res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { 
        author: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/', async (req, res) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: { title, content, authorId }
    });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create post' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, published }
    });
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id }
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete post' });
  }
});

router.post('/:postId/comments', authenticateJWT, async (req, res) => {
  console.log('=== COMMENT CREATION REQUEST ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  console.log('User:', req.user);
  
  const { postId } = req.params;
  const { content } = req.body;
  const authorId = req.user?.id;

  if (!content) {
    console.error('Missing content in request body');
    return res.status(400).json({ error: 'Comment content is required' });
  }
  
  if (!authorId) {
    console.error('No authorId found in request.user');
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    console.log('Creating comment with:', { content, authorId, postId });
    
    const postExists = await prisma.post.findUnique({
      where: { id: String(postId) }
    });
    
    if (!postExists) {
      console.error('Post not found:', postId);
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: String(content),
        authorId: String(authorId),
        postId: String(postId)
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    console.log('Comment created successfully:', comment);
    return res.status(201).json(comment);
    
  } catch (error: unknown) {
    console.error('Error creating comment:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Invalid post or user reference',
        details: 'meta' in error ? error.meta : undefined
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ 
      error: 'Failed to create comment',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

export default router;
