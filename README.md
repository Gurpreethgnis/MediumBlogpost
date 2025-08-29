# DemoName R&D Hub - Rapid Deployment Internal Blog Platform

A **production-ready, rapid deployment** internal knowledge sharing platform built with modern web technologies. This repository allows you to quickly spin up a Medium-style blog for local deployment and consumption within your organization.

## 🚀 Rapid Deployment Features

- **One-Command Setup**: `docker-compose up -d` gets everything running
- **Pre-configured Services**: All services are containerized and ready to go
- **Mock Data Included**: Sample content and users for immediate testing
- **Production-Ready Architecture**: Built with enterprise-grade technologies
- **Zero Configuration**: Works out of the box with sensible defaults

## 🏗️ Architecture Overview

This is a **monorepo** containing three main services:

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Prisma ORM
- **Infrastructure**: PostgreSQL + Redis + MinIO (S3-compatible)

## 📁 Directory Structure

```
MediumBlogpost/
├── 📁 api/                          # Backend API service
│   ├── 📁 src/
│   │   ├── 📁 routes/              # API endpoints (posts, users, auth)
│   │   ├── 📁 middleware/          # Express middleware (auth, validation)
│   │   ├── 📁 utils/               # Utility functions (logger, database)
│   │   ├── 📁 scripts/             # Database seeding scripts
│   │   └── 📄 config/              # Configuration management
│   ├── 📁 prisma/                  # Database schema & migrations
│   ├── 📄 Dockerfile.dev           # Development container
│   ├── 📄 package.json             # Backend dependencies
│   └── 📄 tsconfig.json            # TypeScript configuration
│
├── 📁 web/                         # Frontend React application
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 pages/               # Page components (Home, PostDetail, etc.)
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   ├── 📁 types/               # TypeScript interfaces
│   │   ├── 📁 services/            # API service layer
│   │   └── 📁 styles/              # CSS and styling
│   ├── 📁 public/                  # Static assets
│   ├── 📄 Dockerfile.dev           # Development container
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 tailwind.config.js       # Tailwind CSS configuration
│   └── 📄 vite.config.ts           # Vite build configuration
│
├── 📁 worker/                      # Background job processor
│   ├── 📁 src/                     # Worker logic
│   ├── 📄 Dockerfile.dev           # Development container
│   └── 📄 package.json             # Worker dependencies
│
├── 📄 docker-compose.yml           # Service orchestration
├── 📄 Makefile                     # Development commands
├── 📄 .gitignore                   # Git ignore patterns
└── 📄 README.md                    # This file
```

## ⚡ Getting Started

### Prerequisites

- **Docker & Docker Compose** (latest version)
- **Git** (for cloning the repository)
- **4GB+ RAM** available for all services

### 1. Clone & Navigate

```bash
git clone <your-repository-url>
cd MediumBlogpost
```

### 2. Start All Services

```bash
# Start everything with one command
docker-compose up -d

# Verify all services are running
docker-compose ps
```

### 3. Access Your Blog

- **Frontend**: http://localhost:6545
- **API**: http://localhost:3001
- **Database**: localhost:15432 (PostgreSQL)
- **Cache**: localhost:16379 (Redis)
- **Storage**: http://localhost:9000 (MinIO)

### 4. First Time Setup

The platform comes with:
- ✅ **Pre-configured database** with sample data
- ✅ **Mock users** and authentication
- ✅ **Sample blog posts** in various categories
- ✅ **Working comments system**
- ✅ **Interactive features** (likes, bookmarks)

## 🔧 Development Commands

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f web
docker-compose logs -f api

# Restart a specific service
docker-compose restart web

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## 🎯 Key Features

### Content Management
- **Rich Text Editor**: TipTap-based editor with markdown support
- **Post Categories**: Organize content with tags and spaces
- **Version Control**: Track changes and revisions
- **Media Support**: Upload and manage images/documents

### User Experience
- **Responsive Design**: Works on all devices
- **Search & Filter**: Find content quickly
- **Comments System**: Engage with authors
- **Interactive Elements**: Like, bookmark, and share posts

### Security & Access
- **Role-Based Access**: Reader, Author, Editor, Admin roles
- **Visibility Controls**: Public, Team, or Private posts
- **Audit Logging**: Track all user actions
- **SSO Ready**: OIDC integration for enterprise

## 🚀 Production Deployment

### Environment Variables

Create `.env` files for production:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port

# Authentication
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key

# File Storage
MINIO_ENDPOINT=your-s3-endpoint
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
```

### Build Commands

```bash
# Frontend
cd web && npm run build

# Backend
cd api && npm run build

# Docker production images
docker-compose -f docker-compose.prod.yml build
```

## 🛠️ Customization

### Branding
- Update company name in `web/src/components/Layout.tsx`
- Modify colors in `web/tailwind.config.js`
- Change page titles in `web/index.html`

### Content
- Replace mock data in `web/src/pages/Home.tsx`
- Update sample posts in `web/src/pages/PostDetail.tsx`
- Modify user roles and permissions

### Styling
- Customize CSS in `web/src/index.css`
- Add new Tailwind components
- Modify responsive breakpoints

## 🔍 Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check what's using port 6545
netstat -ano | findstr :6545

# Update ports in docker-compose.yml if needed
```

**Database Connection Issues**
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

**Frontend Not Loading**
```bash
# Check web service logs
docker-compose logs web

# Verify all services are healthy
docker-compose ps
```

## 📊 Performance & Scaling

### Current Configuration
- **Frontend**: Vite dev server with hot reload
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with connection pooling
- **Cache**: Redis for session and data caching
- **Storage**: MinIO for file uploads

### Scaling Options
- **Horizontal Scaling**: Add more API instances
- **Database**: Use managed PostgreSQL service
- **Cache**: Implement Redis cluster
- **Storage**: Switch to AWS S3 or similar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License

Copyright (c) 2025 DemoName R&D Hub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Community**: Join our discussions for help and ideas

## 🎉 What You Get

By the end of this setup, you'll have:

✅ **A fully functional internal blog platform**  
✅ **Modern, responsive UI** with Tailwind CSS  
✅ **Working authentication system** with mock users  
✅ **Content management** with rich text editing  
✅ **Interactive features** like comments and likes  
✅ **Search and filtering** capabilities  
✅ **Role-based access control**  
✅ **Production-ready architecture**  
✅ **Docker containerization** for easy deployment  
✅ **Comprehensive documentation** and examples  

---

**Ready to deploy?** Just run `docker-compose up -d` and visit http://localhost:6545!

Built with ❤️ for rapid internal knowledge sharing
