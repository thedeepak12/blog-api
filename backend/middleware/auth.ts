import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user?: any, info?: any) => {
    console.log('Auth middleware - User:', user);
    console.log('Auth middleware - Error:', err);
    console.log('Auth middleware - Info:', info);
    
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ error: 'Authentication error' });
    }
    
    if (!user) {
      console.error('No user found in JWT');
      return res.status(401).json({ error: 'Unauthorized - Invalid or expired token' });
    }
    
    req.user = user;
    return next();
  })(req, res, next);
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log('Checking admin status for user:', req.user);
  
  if (!req.user) {
    console.error('No user found in request');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.isAdmin !== true) {
    console.error('User is not an admin:', req.user);
    return res.status(403).json({ 
      error: 'Admin access required',
      user: req.user
    });
  }
  
  console.log('User is admin, proceeding...');
  next();
};
