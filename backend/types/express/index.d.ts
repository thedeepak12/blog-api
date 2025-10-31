import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends Omit<User, 'id'> {
      id: string;
    }
    
    interface Request {
      user?: User;
    }
  }
}

export {};
