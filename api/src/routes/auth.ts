import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { config } from '../config';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Mock OIDC strategy for development
passport.use('oidc', new (require('passport-oauth2').Strategy)(
  {
    authorizationURL: `${config.OIDC_ISSUER}/oauth/authorize`,
    tokenURL: `${config.OIDC_ISSUER}/oauth/token`,
    clientID: config.OIDC_CLIENT_ID,
    clientSecret: config.OIDC_CLIENT_SECRET,
    callbackURL: config.OIDC_CALLBACK_URL,
    scope: 'openid profile email',
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // In production, verify the token with the OIDC provider
      // For now, we'll create/update the user based on the profile
      const user = await prisma.user.upsert({
        where: { email: profile.email },
        update: {
          lastLoginAt: new Date(),
        },
        create: {
          email: profile.email,
          name: profile.displayName || profile.name || profile.email,
          role: 'READER', // Default role, can be updated by admin
        },
      });

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// JWT Strategy
passport.use('jwt', new (require('passport-jwt').Strategy)(
  {
    jwtFromRequest: (req: any) => {
      // Check for token in Authorization header or cookies
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        return req.headers.authorization.substring(7);
      }
      return req.cookies?.auth_token;
    },
    secretOrKey: config.JWT_SECRET,
  },
  async (payload: any, done: any) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || !user.isActive) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          statusCode: 401,
        },
      });
    }

    // In production, verify password hash
    // For development, we'll accept any password for existing users
    if (validatedData.password !== 'password') {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          statusCode: 401,
        },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Return user data (without sensitive information)
    const { password, ...userData } = user;

    logger.info('User logged in', { userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      user: userData,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          message: 'Validation error',
          details: error.errors,
        },
      });
    }

    logger.error('Login error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', err);
      return res.status(500).json({
        error: {
          message: 'Error during logout',
          statusCode: 500,
        },
      });
    }

    logger.info('User logged out', { userId: req.user?.id });
    res.json({
      message: 'Logout successful',
    });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        message: 'Not authenticated',
        statusCode: 401,
      },
    });
  }

  res.json({
    user: req.user,
  });
});

// OIDC callback (for production SSO)
router.get('/callback',
  passport.authenticate('oidc', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to app
    res.redirect('/');
  }
);

// OIDC login (initiate SSO flow)
router.get('/oidc', passport.authenticate('oidc'));

export { router as authRoutes };
