import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized - Invalid or missing token',
          statusCode: 401,
        },
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized - Authentication required',
          statusCode: 401,
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          message: 'Forbidden - Insufficient permissions',
          statusCode: 403,
        },
      });
    }

    next();
  };
};

export const requireAuth = authenticateJWT;
export const requireAdmin = requireRole(['ADMIN']);
export const requireEditor = requireRole(['ADMIN', 'EDITOR']);
export const requireAuthor = requireRole(['ADMIN', 'EDITOR', 'AUTHOR']);

// Middleware to check if user can access a specific post
export const canAccessPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id || req.params.postId;
    if (!postId) {
      return next();
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        space: {
          include: {
            members: {
              where: { userId: req.user?.id },
            },
          },
        },
        invitees: {
          where: { id: req.user?.id },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          statusCode: 404,
        },
      });
    }

    // Admin can access everything
    if (req.user?.role === 'ADMIN') {
      return next();
    }

    // Check visibility rules
    if (post.visibility === 'ORG') {
      return next();
    }

    if (post.visibility === 'SPACE') {
      if (!post.space) {
        return res.status(403).json({
          error: {
            message: 'Forbidden - Space posts require space membership',
            statusCode: 403,
          },
        });
      }

      const isMember = post.space.members.length > 0;
      if (!isMember) {
        return res.status(403).json({
          error: {
            message: 'Forbidden - Space membership required',
            statusCode: 403,
          },
        });
      }
      return next();
    }

    if (post.visibility === 'PRIVATE') {
      const isInvited = post.invitees.length > 0;
      const isAuthor = post.authorId === req.user?.id;
      
      if (!isInvited && !isAuthor) {
        return res.status(403).json({
          error: {
            message: 'Forbidden - Private post access denied',
            statusCode: 403,
          },
        });
      }
      return next();
    }

    next();
  } catch (error) {
    logger.error('Error checking post access:', error);
    return res.status(500).json({
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
};
