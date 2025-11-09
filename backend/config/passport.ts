import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    console.log('JWT Payload:', jwtPayload);
    
    const userId = jwtPayload.adminId || jwtPayload.userId || jwtPayload.id || jwtPayload.sub;
    
    if (!userId) {
      console.error('No user ID found in JWT payload');
      return done(null, false, { message: 'No user ID in token' });
    }
    
    const admin = await prisma.admin.findUnique({
      where: { id: userId }
    });
    
    if (!admin) {
      console.error('Admin not found for ID:', userId);
      return done(null, false, { message: 'Admin not found' });
    }
    
    console.log('Authenticated admin:', { id: admin.id, email: admin.email });
    return done(null, admin);
  } catch (error) {
    console.error('Error in JWT authentication:', error);
    return done(error, false);
  }
}));

export default passport;
