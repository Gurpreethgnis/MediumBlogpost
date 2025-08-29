import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { requireAuth, requireAuthor, canAccessPost, AuthenticatedRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  visibility: z.enum(['ORG', 'SPACE', 'PRIVATE']).default('ORG'),
  spaceId: z.string().cuid().optional(),
  featuredImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  inviteeEmails: z.array(z.string().email()).optional(),
});

const updatePostSchema = createPostSchema.partial();

// Create a new post
router.post('/', requireAuth, requireAuthor, async (req: AuthenticatedRequest, res) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    
    // Generate unique slug
    let slug = validatedData.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Check for slug conflicts
    let counter = 1;
    let finalSlug = slug;
    while (await prisma.post.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: finalSlug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        visibility: validatedData.visibility,
        spaceId: validatedData.spaceId,
        featuredImage: validatedData.featuredImage,
        authorId: req.user!.id,
        tags: validatedData.tags ? {
          connectOrCreate: validatedData.tags.map(tag => ({
            where: { name: tag },
            create: { name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') }
          }))
        } : undefined,
        invitees: validatedData.inviteeEmails ? {
          connect: validatedData.inviteeEmails.map(email => ({ email }))
        } : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        space: { select: { id: true, name: true, key: true } },
        tags: { select: { id: true, name: true, slug: true, color: true } },
        invitees: { select: { id: true, name: true, email: true } },
      },
    });

    // Create initial version
    await prisma.postVersion.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
        version: 1,
      },
    });

    logger.info('Post created', { postId: post.id, authorId: req.user!.id });

    res.status(201).json({
      message: 'Post created successfully',
      post,
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
    
    logger.error('Error creating post:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create post',
      },
    });
  }
});

// Get all posts with pagination and filters
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      status = 'PUBLISHED',
      visibility,
      spaceId,
      authorId,
      tag,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause based on user permissions
    let where: any = { status: status as string };
    
    if (visibility) {
      where.visibility = visibility;
    }
    
    if (spaceId) {
      where.spaceId = spaceId;
    }
    
    if (authorId) {
      where.authorId = authorId;
    }
    
    if (tag) {
      where.tags = {
        some: {
          OR: [
            { name: { contains: tag as string, mode: 'insensitive' } },
            { slug: { contains: tag as string, mode: 'insensitive' } },
          ],
        },
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Apply visibility rules for non-admin users
    if (req.user!.role !== 'ADMIN') {
      where.OR = [
        { visibility: 'ORG' },
        {
          visibility: 'SPACE',
          space: {
            members: {
              some: { userId: req.user!.id }
            }
          }
        },
        {
          visibility: 'PRIVATE',
          OR: [
            { authorId: req.user!.id },
            { invitees: { some: { id: req.user!.id } } }
          ]
        }
      ];
    }

    // Get posts with count
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true, avatar: true } },
          space: { select: { id: true, name: true, key: true } },
          tags: { select: { id: true, name: true, slug: true, color: true } },
          _count: {
            select: {
              claps: true,
              comments: true,
              views: true,
            },
          },
        },
        orderBy: { [sortBy as string]: sortOrder as 'asc' | 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Error fetching posts:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch posts',
      },
    });
  }
});

// Get a specific post
router.get('/:id', requireAuth, canAccessPost, async (req: AuthenticatedRequest, res) => {
  try {
    const postId = req.params.id;
    
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        space: { select: { id: true, name: true, key: true } },
        tags: { select: { id: true, name: true, slug: true, color: true } },
        invitees: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
            claps: true,
            comments: true,
            views: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
        },
      });
    }

    // Record view
    await prisma.view.create({
      data: {
        postId: post.id,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });

    res.json({ post });
  } catch (error) {
    logger.error('Error fetching post:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch post',
      },
    });
  }
});

// Update a post
router.put('/:id', requireAuth, canAccessPost, async (req: AuthenticatedRequest, res) => {
  try {
    const postId = req.params.id;
    const validatedData = updatePostSchema.parse(req.body);

    // Check if user can edit this post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, status: true },
    });

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
        },
      });
    }

    if (post.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        error: {
          message: 'Forbidden - Only the author or admin can edit this post',
        },
      });
    }

    // Create new version if content or title changed
    const shouldCreateVersion = validatedData.content || validatedData.title;
    let versionNumber = 1;

    if (shouldCreateVersion) {
      const latestVersion = await prisma.postVersion.findFirst({
        where: { postId },
        orderBy: { version: 'desc' },
      });
      versionNumber = (latestVersion?.version || 0) + 1;

      await prisma.postVersion.create({
        data: {
          postId,
          title: validatedData.title || post.title,
          content: validatedData.content || post.content,
          version: versionNumber,
        },
      });
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...validatedData,
        tags: validatedData.tags ? {
          set: [],
          connectOrCreate: validatedData.tags.map(tag => ({
            where: { name: tag },
            create: { name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') }
          }))
        } : undefined,
        invitees: validatedData.inviteeEmails ? {
          set: [],
          connect: validatedData.inviteeEmails.map(email => ({ email }))
        } : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        space: { select: { id: true, name: true, key: true } },
        tags: { select: { id: true, name: true, slug: true, color: true } },
        invitees: { select: { id: true, name: true, email: true } },
      },
    });

    logger.info('Post updated', { postId, authorId: req.user!.id, version: versionNumber });

    res.json({
      message: 'Post updated successfully',
      post: updatedPost,
      version: versionNumber,
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
    
    logger.error('Error updating post:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update post',
      },
    });
  }
});

// Publish/unpublish a post
router.patch('/:id/publish', requireAuth, canAccessPost, async (req: AuthenticatedRequest, res) => {
  try {
    const postId = req.params.id;
    const { action } = req.body; // 'publish' or 'unpublish'

    if (!['publish', 'unpublish'].includes(action)) {
      return res.status(400).json({
        error: {
          message: 'Invalid action. Must be "publish" or "unpublish"',
        },
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, status: true },
    });

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
        },
      });
    }

    if (post.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        error: {
          message: 'Forbidden - Only the author or admin can publish/unpublish this post',
        },
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: action === 'publish' ? 'PUBLISHED' : 'DRAFT',
        publishedAt: action === 'publish' ? new Date() : null,
      },
    });

    logger.info('Post status changed', { 
      postId, 
      authorId: req.user!.id, 
      action, 
      newStatus: updatedPost.status 
    });

    res.json({
      message: `Post ${action}ed successfully`,
      post: updatedPost,
    });
  } catch (error) {
    logger.error('Error changing post status:', error);
    res.status(500).json({
      error: {
        message: 'Failed to change post status',
      },
    });
  }
});

// Delete a post
router.delete('/:id', requireAuth, canAccessPost, async (req: AuthenticatedRequest, res) => {
  try {
    const postId = req.params.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
        },
      });
    }

    if (post.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        error: {
          message: 'Forbidden - Only the author or admin can delete this post',
        },
      });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    logger.info('Post deleted', { postId, authorId: req.user!.id });

    res.json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting post:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete post',
      },
    });
  }
});

// Get post versions
router.get('/:id/versions', requireAuth, canAccessPost, async (req: AuthenticatedRequest, res) => {
  try {
    const postId = req.params.id;

    const versions = await prisma.postVersion.findMany({
      where: { postId },
      orderBy: { version: 'desc' },
    });

    res.json({ versions });
  } catch (error) {
    logger.error('Error fetching post versions:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch post versions',
      },
    });
  }
});

export { router as postRoutes };
