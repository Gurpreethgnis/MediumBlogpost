import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const authorUser = await prisma.user.upsert({
    where: { email: 'author@company.com' },
    update: {},
    create: {
      email: 'author@company.com',
      name: 'John Author',
      role: 'AUTHOR',
      isActive: true,
    },
  });

  const readerUser = await prisma.user.upsert({
    where: { email: 'reader@company.com' },
    update: {},
    create: {
      email: 'reader@company.com',
      name: 'Jane Reader',
      role: 'READER',
      isActive: true,
    },
  });

  console.log('✅ Users created');

  // Create sample spaces
  const engineeringSpace = await prisma.space.upsert({
    where: { key: 'engineering' },
    update: {},
    create: {
      key: 'engineering',
      name: 'Engineering',
      description: 'Engineering team content and discussions',
      isPublic: false,
    },
  });

  const marketingSpace = await prisma.space.upsert({
    where: { key: 'marketing' },
    update: {},
    create: {
      key: 'marketing',
      name: 'Marketing',
      description: 'Marketing team content and campaigns',
      isPublic: false,
    },
  });

  console.log('✅ Spaces created');

  // Add users to spaces
  await prisma.spaceMember.upsert({
    where: {
      userId_spaceId: {
        userId: authorUser.id,
        spaceId: engineeringSpace.id,
      },
    },
    update: {},
    create: {
      userId: authorUser.id,
      spaceId: engineeringSpace.id,
      role: 'AUTHOR',
    },
  });

  await prisma.spaceMember.upsert({
    where: {
      userId_spaceId: {
        userId: readerUser.id,
        spaceId: engineeringSpace.id,
      },
    },
    update: {},
    create: {
      userId: readerUser.id,
      spaceId: engineeringSpace.id,
      role: 'READER',
    },
  });

  console.log('✅ Space memberships created');

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        color: '#3B82F6',
      },
    }),
    prisma.tag.upsert({
      where: { name: 'Product' },
      update: {},
      create: {
        name: 'Product',
        slug: 'product',
        color: '#10B981',
      },
    }),
    prisma.tag.upsert({
      where: { name: 'Design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        color: '#8B5CF6',
      },
    }),
  ]);

  console.log('✅ Tags created');

  // Create sample posts
  const samplePost = await prisma.post.create({
    data: {
      title: 'Welcome to Our Internal Blog Platform',
      slug: 'welcome-to-our-internal-blog-platform',
      excerpt: 'A brief introduction to our new internal blogging platform for company communication.',
      content: `
        <h1>Welcome to Our Internal Blog Platform!</h1>
        <p>This is our new internal blogging platform designed to facilitate better communication within our organization.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li><strong>Rich Text Editor:</strong> Create beautiful, formatted content with our TipTap-based editor</li>
          <li><strong>Role-Based Access:</strong> Control who can read and write content</li>
          <li><strong>Spaces:</strong> Organize content by team or department</li>
          <li><strong>Version History:</strong> Track changes and maintain content integrity</li>
        </ul>
        
        <h2>Getting Started</h2>
        <p>To get started:</p>
        <ol>
          <li>Explore existing posts to see what others are sharing</li>
          <li>Create your first post using the "New Post" button</li>
          <li>Join relevant spaces to access team-specific content</li>
          <li>Engage with content through comments and reactions</li>
        </ol>
        
        <blockquote>
          <p>"The best way to predict the future is to invent it." - Alan Kay</p>
        </blockquote>
        
        <p>We're excited to see how this platform will help us share knowledge, collaborate better, and stay connected as a team.</p>
      `,
      status: 'PUBLISHED',
      visibility: 'ORG',
      publishedAt: new Date(),
      authorId: adminUser.id,
      tags: {
        connect: tags.map(tag => ({ id: tag.id })),
      },
    },
  });

  const engineeringPost = await prisma.post.create({
    data: {
      title: 'Engineering Best Practices',
      slug: 'engineering-best-practices',
      excerpt: 'A collection of engineering best practices we follow in our development process.',
      content: `
        <h1>Engineering Best Practices</h1>
        <p>As our engineering team grows, it's important to establish and maintain consistent best practices.</p>
        
        <h2>Code Quality</h2>
        <ul>
          <li>Write clean, readable code</li>
          <li>Use meaningful variable and function names</li>
          <li>Add comprehensive tests</li>
          <li>Review code thoroughly before merging</li>
        </ul>
        
        <h2>Documentation</h2>
        <p>Good documentation is crucial for maintainability:</p>
        <ul>
          <li>Document complex algorithms and business logic</li>
          <li>Keep README files up to date</li>
          <li>Use clear commit messages</li>
        </ul>
      `,
      status: 'PUBLISHED',
      visibility: 'SPACE',
      publishedAt: new Date(),
      authorId: authorUser.id,
      spaceId: engineeringSpace.id,
      tags: {
        connect: [tags[0]], // Technology tag
      },
    },
  });

  console.log('✅ Sample posts created');

  // Create sample comments
  await prisma.comment.create({
    data: {
      content: 'Great post! This will be really helpful for our team.',
      authorId: readerUser.id,
      postId: samplePost.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Thanks for sharing these best practices. I especially like the emphasis on documentation.',
      authorId: authorUser.id,
      postId: engineeringPost.id,
    },
  });

  console.log('✅ Sample comments created');

  // Create sample claps
  await prisma.clap.create({
    data: {
      userId: readerUser.id,
      postId: samplePost.id,
      count: 3,
    },
  });

  await prisma.clap.create({
    data: {
      userId: authorUser.id,
      postId: engineeringPost.id,
      count: 2,
    },
  });

  console.log('✅ Sample claps created');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.space.count()} spaces`);
  console.log(`Created ${await prisma.post.count()} posts`);
  console.log(`Created ${await prisma.tag.count()} tags`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
